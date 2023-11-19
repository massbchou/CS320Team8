/**
 * Ensures that you aren't accidentally missing a parameter
 * Use as default parameter, unless you define your own default
 * Stupid javascript and optional parameters >:(
 */
export default function mp() {
  throw new Error("Missing parameter");
}
