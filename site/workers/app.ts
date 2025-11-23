export interface Env {
  x61_d1_db: D1Database;
}

export default {
  async fetch(request: Request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/challenges") {
      const { results } = await env.x61ctf_d1_db.prepare("select * from challenges").run();
      return Response.json(results);
    }
    return new Response(null, { status: 404 });
  }
} satisfies ExportedHandler<Env>;

