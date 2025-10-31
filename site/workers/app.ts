export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/challenges") {
      // If you did not use `DB` as your binding name, change it here
      //const { res } = await env.x61ctf_d1_db.prepare("SELECT * FROM Customers");
      const results = { name: "reached", value: "challenges" };
      return Response.json(results);
    }
    if (pathname === "/env") {
      return Response.json({ value: "/env" });
    }
    return Response.json({ name: "hello", value: "world" });
  }
} satisfies ExportedHandler;

