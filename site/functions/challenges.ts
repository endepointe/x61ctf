interface Env { 
  x61ctf_d1_db: D1Database;
};

export const onRequest: PagesFunction<Env> = async (context) => { 
  const ps = context.env.x61ctf_d1_db.prepare("select * from Customers");
  const data = await ps.first();
  return Response.json(data);
}

/*
export async function onRequest(context) { 
  const { results } = await env.x61ctf_d1_db.prepare(
    "SELECT * FROM Customers WHERE CompanyName = ?",
  )
  .bind("Bs Beverages")
 
  return new Response("you have reached /challenges");
}
*/
