import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

//const requestHandler = createRequestHandler(
//  () => import("virtual:react-router/server-build"),
//  import.meta.env.MODE
//);
//
export default {
  async fetch(request, env, ctx) {

    const { pathname } = new URL(request.url);

    if (pathname === "/beverages") {
      // If you did not use `DB` as your binding name, change it here
      //const { res } = await env.x61ctf_d1_db.prepare("SELECT * FROM Customers");
      const results = { name: "hello", value: "world" };
      return Response.json(results);
    }

    if (pathname === "/env") {
      return Response.json({ env });
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;

//import { WorkerEntrypoint } from "cloudflare:workers";
//export default class extends WorkerEntrypoint {
//  async fetch(request: Request) {
//    return new Response("x61ctf");
//  }
//}
//
//type Env {
//  // If you set another name in the Wrangler config file for the value for 'binding',
//  // replace "DB" with the variable name you defined.
//  x61ctf_d1_db: D1Database;
//}
/*
export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/beverages") {
      // If you did not use `DB` as your binding name, change it here
      //const { res } = await env.x61ctf_d1_db.prepare("SELECT * FROM Customers");
      const results = { name: "hello", value: "world" };
      return Response.json(results);
    }

    if (pathname === "/env") {
      return Response.json({ env });
    }
    
    return await env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler;
*/

