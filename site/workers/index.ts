export interface Env { 
  x61ctf_d1_db: D1Database;
};

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/challenges") {
      return Response.json(results);
    }
    return null;
  },
} satisfies ExportedHandler<Env>;
