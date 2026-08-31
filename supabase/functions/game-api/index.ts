import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Content-Type":"application/json"};
const db=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:cors});
const digest=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))).map(byte=>byte.toString(16).padStart(2,"0")).join("");
const newToken=()=>`${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll("-","");
const newGameCode=()=>{const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";return Array.from({length:6},()=>alphabet[Math.floor(Math.random()*alphabet.length)]).join("")};

async function gameByCode(code:string){const{data}=await db.from("games").select("*").eq("code",code).maybeSingle();return data;}
async function validAdmin(gameId:string,token:string){if(!token)return false;const{data}=await db.from("game_admin_secrets").select("token_hash").eq("game_id",gameId).maybeSingle();return data?.token_hash===await digest(token);}
async function validTeam(teamId:string,token:string){if(!token)return false;const{data}=await db.from("team_secrets").select("token_hash").eq("team_id",teamId).maybeSingle();return data?.token_hash===await digest(token);}
async function standings(gameId:string){const{data}=await db.from("team_standings").select("team_id,team_name,rank,net_assets,total_return,submitted,updated_at").eq("game_id",gameId).order("rank");return data??[];}

Deno.serve(async request=>{
  if(request.method==="OPTIONS")return new Response("ok",{headers:cors});
  try{
    const body=await request.json(); const action=String(body.action??"");
    if(action==="create_game"){
      const adminToken=newToken();let createdGame=null;
      for(let attempt=0;attempt<5&&!createdGame;attempt++){
        const code=newGameCode();const{data,error}=await db.from("games").insert({code,name:String(body.name??"투자왕 결정전").trim().slice(0,40)||"투자왕 결정전",status:"lobby",current_turn:1,total_turns:Math.min(10,Math.max(5,Number(body.totalTurns??8))),max_teams:Math.min(12,Math.max(2,Number(body.maxTeams??12))),initial_budget:Number(body.initialBudget??100000000),minimum_turnover:Number(body.minimumTurnover??20),base_rate:3}).select().single();
        if(!error)createdGame=data;else if(error.code!=="23505")return reply({error:error.message},400);
      }
      if(!createdGame)return reply({error:"게임 코드를 생성하지 못했습니다. 다시 시도해주세요."},500);
      await db.from("game_admin_secrets").insert({game_id:createdGame.id,token_hash:await digest(adminToken)});
      return reply({gameCode:createdGame.code,adminToken,game:createdGame},201);
    }
    const code=String(body.code??"").trim().toUpperCase();if(!code)return reply({error:"게임 코드를 입력해주세요."},400);const game=await gameByCode(code);
    if(!game)return reply({error:"게임을 찾을 수 없습니다."},404);

    if(action==="claim_admin"){
      const{data:existing}=await db.from("game_admin_secrets").select("token_hash").eq("game_id",game.id).maybeSingle();
      if(existing&&!await validAdmin(game.id,String(body.adminToken??"")))return reply({error:"이미 다른 관리자가 게임을 관리하고 있습니다."},403);
      const token=existing?String(body.adminToken):newToken();
      if(!existing)await db.from("game_admin_secrets").insert({game_id:game.id,token_hash:await digest(token)});
      if(game.status==="lobby")await db.from("games").update({initial_budget:Number(body.initialBudget??game.initial_budget),minimum_turnover:Number(body.minimumTurnover??game.minimum_turnover),max_teams:Math.min(12,Math.max(2,Number(body.maxTeams??game.max_teams))),updated_at:new Date().toISOString()}).eq("id",game.id);
      return reply({adminToken:token});
    }

    if(action==="join"){
      if(game.status!=="lobby")return reply({error:"이미 게임이 시작되었습니다."},409);
      const name=String(body.name??"").trim().slice(0,16); if(!name)return reply({error:"팀명을 입력해주세요."},400);
      const{count}=await db.from("teams").select("id",{count:"exact",head:true}).eq("game_id",game.id); if((count??0)>=game.max_teams)return reply({error:"참가 가능한 팀 수를 초과했습니다."},409);
      const token=newToken(); const{data:team,error}=await db.from("teams").insert({game_id:game.id,name,assets:game.initial_budget,rank:(count??0)+1,previous_rank:(count??0)+1}).select().single();
      if(error)return reply({error:error.code==="23505"?"이미 사용 중인 팀명입니다.":error.message},409);
      await db.from("team_secrets").insert({team_id:team.id,token_hash:await digest(token)});
      await db.from("team_standings").insert({team_id:team.id,game_id:game.id,team_name:name,rank:team.rank,net_assets:team.assets,total_return:0,submitted:false});
      return reply({teamId:team.id,teamToken:token,team});
    }

    if(action==="sync"){
      const{data:finalResults}=game.status==="finished"?await db.from("final_results").select("id,team_number,team_name,final_rank,final_net_assets,total_return,turn_return,investor_metrics").eq("game_id",game.id).order("final_rank"):{data:[]};
      const result:{game:unknown;standings:unknown;finalResults:unknown;team?:unknown;teams?:unknown}={game,standings:await standings(game.id),finalResults:finalResults??[]};
      if(body.teamId&&await validTeam(String(body.teamId),String(body.teamToken??""))){const{data}=await db.from("teams").select("*").eq("id",body.teamId).eq("game_id",game.id).single();result.team=data;}
      if(await validAdmin(game.id,String(body.adminToken??""))){const{data}=await db.from("teams").select("*").eq("game_id",game.id).order("rank");result.teams=data??[];}
      return reply(result);
    }

    if(action==="submit_portfolio"){
      if(game.status!=="playing")return reply({error:"관리자가 게임을 시작한 뒤 포트폴리오를 구성할 수 있습니다."},409);
      const teamId=String(body.teamId??"");if(!await validTeam(teamId,String(body.teamToken??"")))return reply({error:"팀 인증이 만료되었습니다."},403);
      const positions=Array.isArray(body.positions)?body.positions:[];if(positions.length<1||positions.length>5)return reply({error:"1~5개 종목을 선택해야 합니다."},400);
      const total=positions.reduce((sum:number,item:{weight?:number})=>sum+Number(item.weight??0),0);if(total!==100)return reply({error:"포트폴리오 비중 합계는 100%여야 합니다."},400);
      const{data:team}=await db.from("teams").select("portfolio,previous_portfolio").eq("id",teamId).eq("game_id",game.id).single();const current=Array.isArray(team?.portfolio)?team.portfolio:[];const savedBaseline=Array.isArray(team?.previous_portfolio)?team.previous_portfolio:[];const previous=game.current_turn===1?[]:(savedBaseline.length?savedBaseline:current);
      const ids=new Set([...previous.map((item:{companyId:string})=>item.companyId),...positions.map((item:{companyId:string})=>item.companyId)]);let difference=0;ids.forEach(id=>{difference+=Math.abs(Number(previous.find((item:{companyId:string})=>item.companyId===id)?.weight??0)-Number(positions.find((item:{companyId:string})=>item.companyId===id)?.weight??0))});const turnover=difference/2;
      if(game.current_turn>1&&turnover<Number(game.minimum_turnover))return reply({error:`최소 변경률 ${game.minimum_turnover}%를 충족하지 못했습니다.`},400);
      await db.from("teams").update({portfolio:positions,focus:String(body.focus??"AI·반도체"),turnover_rate:turnover,submitted:true}).eq("id",teamId).eq("game_id",game.id);
      await db.from("team_standings").update({submitted:true,updated_at:new Date().toISOString()}).eq("team_id",teamId);
      return reply({ok:true,turnover});
    }

    if(action==="reopen_portfolio"){
      if(game.status!=="playing")return reply({error:"진행 중인 게임에서만 포트폴리오를 수정할 수 있습니다."},409);
      const teamId=String(body.teamId??"");if(!await validTeam(teamId,String(body.teamToken??"")))return reply({error:"팀 인증이 만료되었습니다."},403);
      await db.from("teams").update({submitted:false}).eq("id",teamId).eq("game_id",game.id);
      await db.from("team_standings").update({submitted:false,updated_at:new Date().toISOString()}).eq("team_id",teamId).eq("game_id",game.id);
      return reply({ok:true});
    }

    if(action==="loan"){
      if(game.status!=="playing")return reply({error:"관리자가 게임을 시작한 뒤 대출을 이용할 수 있습니다."},409);
      const teamId=String(body.teamId??"");if(!await validTeam(teamId,String(body.teamToken??"")))return reply({error:"팀 인증이 만료되었습니다."},403);
      const{data:team}=await db.from("teams").select("*").eq("id",teamId).single();const amount=Math.max(0,Math.round(Number(body.amount??0)));const mode=body.mode==="repay"?"repay":"borrow";
      if(mode==="borrow"){const limit=game.initial_budget*.5-team.loan_balance;if(amount<=0||amount>limit)return reply({error:"대출 한도를 초과했습니다."},400);team.assets+=amount;team.loan_balance+=amount;}
      else{const due=team.loan_balance+team.accrued_interest;if(amount<=0||amount>due||amount>team.assets)return reply({error:"상환 금액을 확인해주세요."},400);const interest=Math.min(amount,team.accrued_interest);team.assets-=amount;team.accrued_interest-=interest;team.loan_balance=Math.max(0,team.loan_balance-(amount-interest));}
      await db.from("teams").update({assets:team.assets,loan_balance:team.loan_balance,accrued_interest:team.accrued_interest}).eq("id",teamId);await db.from("team_standings").update({net_assets:team.assets-team.loan_balance-team.accrued_interest,updated_at:new Date().toISOString()}).eq("team_id",teamId);return reply({team});
    }

    if(action==="start"||action==="advance"){
      if(!await validAdmin(game.id,String(body.adminToken??"")))return reply({error:"관리자 인증이 필요합니다."},403);
      if(action==="start"){const{count}=await db.from("teams").select("id",{count:"exact",head:true}).eq("game_id",game.id);if((count??0)<2)return reply({error:"최소 2개 팀이 필요합니다."},400);await db.from("games").update({status:"playing",current_turn:1,updated_at:new Date().toISOString()}).eq("id",game.id);return reply({ok:true});}
      const returns=(body.returns??{}) as Record<string,number>;const nextRate=Math.min(7,Math.max(1,Number(body.baseRate??game.base_rate)));const{data:teams}=await db.from("teams").select("*").eq("game_id",game.id);
      if(game.current_turn===1){for(const team of teams??[]){const portfolio=Array.isArray(team.portfolio)?team.portfolio:[];await db.from("teams").update({previous_portfolio:portfolio,submitted:false,turnover_rate:0}).eq("id",team.id);await db.from("team_standings").update({submitted:false,updated_at:new Date().toISOString()}).eq("team_id",team.id);}await db.from("games").update({current_turn:2,base_rate:nextRate,updated_at:new Date().toISOString()}).eq("id",game.id);return reply({ok:true,newsReleased:true});}
      const ranked=[];
      for(const team of teams??[]){const portfolio=Array.isArray(team.portfolio)?team.portfolio:[];const marketReturn=portfolio.reduce((sum:number,item:{companyId:string;weight:number})=>sum+(Number(returns[item.companyId]??0)*Number(item.weight)/100),0);const assets=Math.round(team.assets*(1+marketReturn/100));const interest=Math.round(team.loan_balance*(nextRate+game.loan_spread)/100/4);const accrued=team.accrued_interest+interest;const net=assets-team.loan_balance-accrued;ranked.push({...team,assets,accrued_interest:accrued,turn_return:marketReturn,total_return:Number(((net/game.initial_budget-1)*100).toFixed(2)),submitted:false,previous_rank:team.rank,net});}
      ranked.sort((a,b)=>b.net-a.net);for(let index=0;index<ranked.length;index++){const team=ranked[index];await db.from("teams").update({assets:team.assets,accrued_interest:team.accrued_interest,turn_return:team.turn_return,total_return:team.total_return,submitted:false,previous_portfolio:team.portfolio,previous_rank:team.previous_rank,rank:index+1}).eq("id",team.id);await db.from("team_standings").upsert({team_id:team.id,game_id:game.id,team_name:team.name,rank:index+1,net_assets:team.net,total_return:team.total_return,submitted:false,updated_at:new Date().toISOString()});}
      const nextTurn=game.current_turn+1;await db.from("games").update({status:nextTurn>game.total_turns?"finished":"playing",current_turn:Math.min(nextTurn,game.total_turns),base_rate:nextRate,updated_at:new Date().toISOString()}).eq("id",game.id);return reply({ok:true});
    }
    return reply({error:"지원하지 않는 작업입니다."},400);
  }catch(error){return reply({error:error instanceof Error?error.message:"서버 오류가 발생했습니다."},500)}
});
