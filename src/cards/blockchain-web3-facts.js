import { generateHTMLCard, Languages } from '../core/card-generator';
import { loadJSONFile } from '../utils/load-json-file';

export default async function blockchainFactsHandler({ req, env }) {
  
  // Load Blockchain/Web3 facts JSON
  const facts = await loadJSONFile(env, 'blockchain_facts.json');

  // Pick a random fact
  const randomFact = facts[Math.floor(Math.random() * facts.length)];


  // Default language (mostly English for now)
  let language = Languages.ENGLISH;
  let cardContent = `Blockchain Fact of the Day:\n\n"${randomFact.quote}"`;

  // If fact has language metadata, adjust accordingly
  if (randomFact.lang && randomFact.lang.toLowerCase() === 'hi') {
    language = Languages.HINDI;
    cardContent = `आज का ब्लॉकचेन तथ्य:\n\n"${randomFact.quote}"`;
  }
  // Extract theme and params from URL
  const url = new URL(req.url);
  const theme = url.searchParams.get('theme') || 'GALACTIC_DUSK'; // default new theme idea
  const searchParams = Object.fromEntries(url.searchParams.entries());

  // Generate SVG card with given theme
  const svgCard = await generateHTMLCard(env, cardContent, searchParams, language, theme);

  return new Response(svgCard, {
    headers: {
      'Content-Type': 'image/svg+xml'
    },
  });
}
