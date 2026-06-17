import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const CACHE_DIR = join(__dirname, "../src/cache");

const ENDPOINTS: Array<{ url: string; slug: string }> = [
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/Monster.json",
    slug: "proto__Monster.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/MonsterBase.json",
    slug: "proto__MonsterBase.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/lsd/monster_name_en.json",
    slug: "lsd__monster_name_en.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/MonsterVariation.json",
    slug: "proto__MonsterVariation.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/Move.json",
    slug: "proto__Move.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/lsd/move_name_en.json",
    slug: "lsd__move_name_en.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/lsd/move_description_en.json",
    slug: "lsd__move_description_en.json"
  },
  {
    url:
      "https://pokemon.brybry.ch/masters/data/lsd/move_description_parts_en.json",
    slug: "lsd__move_description_parts_en.json"
  },
  {
    url:
      "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_en.json",
    slug: "lsd__passive_skill_name_en.json"
  },
  {
    url:
      "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_name_parts_en.json",
    slug: "lsd__passive_skill_name_parts_en.json"
  },
  {
    url:
      "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_description_en.json",
    slug: "lsd__passive_skill_description_en.json"
  },
  {
    url:
      "https://pokemon.brybry.ch/masters/data/lsd/passive_skill_description_parts_en.json",
    slug: "lsd__passive_skill_description_parts_en.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/PassiveSkillChild.json",
    slug: "proto__PassiveSkillChild.json"
  },
  {
    url:
      "https://pokemon.brybry.ch/masters/data/proto/MoveAndPassiveSkillDigit.json",
    slug: "proto__MoveAndPassiveSkillDigit.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/Trainer.json",
    slug: "proto__Trainer.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/TrainerBase.json",
    slug: "proto__TrainerBase.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/lsd/trainer_name_en.json",
    slug: "lsd__trainer_name_en.json"
  },
  {
    url:
      "https://pokemon.brybry.ch/masters/data/lsd/trainer_verbose_name_en.json",
    slug: "lsd__trainer_verbose_name_en.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/TrainerExRole.json",
    slug: "proto__TrainerExRole.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/Ability.json",
    slug: "proto__Ability.json"
  },
  {
    url: "https://pokemon.brybry.ch/masters/data/proto/AbilityPanel.json",
    slug: "proto__AbilityPanel.json"
  }
];

async function fetchEndpoint(url: string, slug: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  await writeFile(join(CACHE_DIR, slug), JSON.stringify(json, null, 2));
  console.log(`✓ ${slug}`);
}

async function main(): Promise<void> {
  const results = await Promise.allSettled(
    ENDPOINTS.map(({ url, slug }) => fetchEndpoint(url, slug))
  );

  const failures = results
    .map((r, i) => ({ r, endpoint: ENDPOINTS[i] }))
    .filter(({ r }) => r.status === "rejected");

  if (failures.length > 0) {
    for (const { r, endpoint } of failures) {
      const reason = (r as PromiseRejectedResult).reason;
      console.error(`✗ ${endpoint.slug} — ${reason}`);
    }
    process.exit(1);
  }

  console.log(`\nAll ${ENDPOINTS.length} endpoints cached successfully.`);
}

main();
