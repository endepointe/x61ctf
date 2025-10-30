export interface Env { 
  x61ctf_d1_db: D1Database;
};

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/challenges") {
      const { results } = await env.x61ctf_d1_db.prepare(
        "SELECT * FROM Customers WHERE CompanyName = ?",
      )
      .bind("Bs Beverages")
      .run();
      return Response.json(results);
    }
    return null;
  },
} satisfies ExportedHandler<Env>;
