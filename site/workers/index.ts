export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    console.log(pathname);

    if (pathname === "/api/challenges") {
      return Response.json(results);
    }

    return new Response(
      "Call /api/challenges to see all challenges",
    );
  },
} satisfies ExportedHandler<String>;
