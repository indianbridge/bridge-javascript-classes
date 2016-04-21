/**
 * @fileOverview Lodash templates for hand diagrams, auctions etc.
 * @author Sriram Narasimhan
 * @version 1.0.0
 */
// Get Namespace.
var Bridge = Bridge || {};
Bridge.templates = {
	"hand": {},
	"auction": {},
};
Bridge.templates.hand["inline"] = `
<hand class="inline">
	<content><%= data.cards %></content>
<hand>
`;
