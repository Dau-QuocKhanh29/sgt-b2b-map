import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(here, "..");
const seedPath = path.resolve(frontendRoot, "../BackEnd/src/main/resources/db/dev-seed/V0__dev_seed_200_partners.sql");
const outputPath = path.resolve(frontendRoot, "src/features/partners/data/mockPartners.json");
const sql = fs.readFileSync(seedPath, "utf8");

function parseLiteral(token) {
  const value = token.trim();
  if (value === "NULL") return null;
  if (value === "TRUE") return true;
  if (value === "FALSE") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  throw new Error(`Unsupported SQL literal: ${value}`);
}

function parseTuples(block) {
  const tuples = [];
  let current = "";
  let depth = 0;
  let quoted = false;
  for (let index = 0; index < block.length; index += 1) {
    const char = block[index];
    const next = block[index + 1];
    if (char === "'" && quoted && next === "'") { current += "''"; index += 1; continue; }
    if (char === "'") quoted = !quoted;
    if (!quoted && char === "(") { if (depth === 0) current = ""; else current += char; depth += 1; continue; }
    if (!quoted && char === ")") { depth -= 1; if (depth === 0) { tuples.push(current); continue; } }
    if (depth > 0) current += char;
  }
  return tuples.map((tuple) => {
    const values = [];
    let token = "";
    let inQuote = false;
    for (let index = 0; index < tuple.length; index += 1) {
      const char = tuple[index];
      const next = tuple[index + 1];
      if (char === "'" && inQuote && next === "'") { token += "''"; index += 1; continue; }
      if (char === "'") inQuote = !inQuote;
      if (char === "," && !inQuote) { values.push(parseLiteral(token)); token = ""; }
      else token += char;
    }
    values.push(parseLiteral(token));
    return values;
  });
}

function findBlocks(table, terminator = "ON DUPLICATE KEY UPDATE") {
  const pattern = new RegExp(`INSERT(?: IGNORE)? INTO ${table}\\s*\\([^;]+?\\) VALUES\\s*([\\s\\S]*?)(?=\\n${terminator}|;)`, "g");
  return [...sql.matchAll(pattern)].map((match) => parseTuples(match[1]));
}

const toMap = (rows, valueIndex = 1) => new Map(rows.map((row) => [row[0], row[valueIndex]]));
const countries = new Map(findBlocks("geo_countries").flat().map((row) => [row[0], { iso2: row[1], name: row[2] }]));
const regions = new Map(findBlocks("geo_regions").flat().map((row) => [row[0], { countryId: row[1], parentId: row[2], type: row[3], code: row[4], name: row[5] }]));
const industries = toMap(findBlocks("industries").flat());
const tags = toMap(findBlocks("tags").flat());
const salespersons = toMap(findBlocks("salespersons").flat());
const sources = new Map(findBlocks("partner_sources").flat().map((row) => [row[0], { code: row[1], name: row[2] }]));
const partnerRows = findBlocks("partners").flat();
const locationRows = findBlocks("partner_locations").flat();
const industryLinks = findBlocks("partner_industries", ";").flat();
const tagLinks = findBlocks("partner_tags", ";").flat();

const locationsByPartner = new Map(locationRows.map((row) => [row[0], row]));
const industriesByPartner = new Map();
const tagsByPartner = new Map();
industryLinks.forEach(([partnerId, industryId]) => industriesByPartner.set(partnerId, [...(industriesByPartner.get(partnerId) || []), industries.get(industryId)]));
tagLinks.forEach(([partnerId, tagId]) => tagsByPartner.set(partnerId, [...(tagsByPartner.get(partnerId) || []), tags.get(tagId)]));

const partners = partnerRows.map((row) => {
  const [id, name, relationshipStatus, isActive, sourceId, externalId, website, salespersonId] = row;
  const location = locationsByPartner.get(id);
  const country = location ? countries.get(location[2]) : null;
  return {
    id,
    externalId,
    name,
    relationshipStatus,
    isActive,
    website,
    salespersonId,
    salesperson: salespersons.get(salespersonId) || null,
    sourceId,
    source: sources.get(sourceId)?.name || null,
    address: location?.[1] || null,
    countryCode: country?.iso2 || null,
    country: country?.name || null,
    admin1RegionId: location?.[3] || null,
    region: regions.get(location?.[3])?.name || location?.[5] || null,
    admin2RegionId: location?.[4] || null,
    district: regions.get(location?.[4])?.name || location?.[6] || null,
    latitude: location?.[7] ?? null,
    longitude: location?.[8] ?? null,
    geocodeStatus: location?.[9] || "MISSING",
    industries: industriesByPartner.get(id) || [],
    tags: tagsByPartner.get(id) || [],
    updatedAt: "2026-10-28T00:00:00Z"
  };
});

const mapped = partners.filter((partner) => partner.geocodeStatus === "VALID").length;
if (partners.length !== 200 || mapped !== 180 || partners.length - mapped !== 20) {
  throw new Error(`Seed invariant failed: total=${partners.length}, mapped=${mapped}, unmapped=${partners.length - mapped}`);
}

fs.writeFileSync(outputPath, `${JSON.stringify(partners, null, 2)}\n`, "utf8");
console.log(`Generated ${partners.length} partners (${mapped} mapped, ${partners.length - mapped} unmapped) from ${seedPath}`);
