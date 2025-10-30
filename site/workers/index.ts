interface Env {
  // If you set another name in the Wrangler config file for the value for 'binding',
  // replace "DB" with the variable name you defined.
  x61ctf_d1_db: D1Database;
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/beverages") {
      // If you did not use `DB` as your binding name, change it here
      ///*
      const { res } = await env.x61ctf_d1_db.prepare("SELECT * FROM Customers");
      //*/
      const results = { name: "hello", value: "world" };
      return Response.json(results);
    }
    
    return new Response(
      "Call /beverages to see everyone who works at Bs Beverages",
    );
  },
} satisfies ExportedHandler<Env>;
