export interface Env {
  // If you set another name in the Wrangler config file for the value for 'binding',
  // replace "DB" with the variable name you defined.
  x61_d1_db: D1Database;
}

export default {
  async fetch(request: Request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/challenges") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.x61ctf_d1_db.prepare("select * from challenges").run();
      return Response.json(results);
    }
    return new Response(null, { status: 404 });
  }
} satisfies ExportedHandler<Env>;

