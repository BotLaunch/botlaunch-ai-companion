// Reads your plan, then enables captcha using the module's REAL default config shape
// (fetched from /bot-modules/definitions — never hardcode config fields).
//   BOTLAUNCH_API_KEY=bl_live_... GROUP_ID=... node examples/node/connect-and-configure.mjs
import { BotLaunch } from '../../sdk/node/botlaunch.mjs';

const bl = new BotLaunch(process.env.BOTLAUNCH_API_KEY);
const groupId = process.env.GROUP_ID;

const ctx = await bl.context();
console.log(`Plan: ${ctx.planName} · scopes: ${ctx.scopes?.join(', ')}`);

const defs = await bl.moduleDefinitions();
const captcha = (defs.data ?? defs).find((m) => m.type === 'CAPTCHA');
if (!captcha) throw new Error('CAPTCHA definition not found');

await bl.setModule(groupId, 'CAPTCHA', true, captcha.defaultConfig);
console.log('Captcha enabled with default config.');
