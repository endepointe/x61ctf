export function onRequest(context) { 
  alert("there you are");
  return new Response("you have reached /api/challenges");
}
