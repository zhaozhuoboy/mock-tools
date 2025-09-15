import { defineEventHandler } from "h3";
import { initDatabase } from "../database/init";
initDatabase();
export default defineEventHandler(() => {})