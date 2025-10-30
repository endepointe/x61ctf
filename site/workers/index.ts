// https://developers.cloudflare.com/pages/functions/wrangler-configuration/
export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/challenges") {
      return Response.json(results);
    }
  },
} satisfies ExportedHandler;
