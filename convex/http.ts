import { httpRouter } from "convex/server";
import { auth } from "./auth.js";

const http = httpRouter();

// This line is crucial: it exposes the auth endpoints to your frontend
auth.addHttpRoutes(http);

export default http;