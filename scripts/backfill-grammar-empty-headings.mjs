import fs from "node:fs";

const additions = {
  13: { page: "162", id: "g4", title: "4. 动词的“ます形”" },
  14: { page: "171", id: "g1", title: "1. 动词的“て形”" },
  19: { page: "227", id: "g1", title: "1. 动词的“ない形”" },
  20: { page: "237", id: "g1", title: "1. 动词的“基本形”" },
  21: { page: "253", id: "g1", title: "1. 动词的“た形”" },
  22: { page: "263", id: "g1", title: "1. 敬体形和简体形" },
};

const expressionAdditions = {
  3: [{ page: "45", id: "e1", title: "1. 1階" }, { page: "45", id: "e4", title: "4. 缩略词" }],
  4: [{ page: "55", id: "e3", title: "3. ご家族／ご兄弟／ご両親" }],
  7: [{ page: "91", id: "e1", title: "1. “何”的读法—“なん”和“なに”" }, { page: "91", id: "e2", title: "2. そうですか" }, { page: "91", id: "e3", title: "3. そうですね①" }, { page: "91", id: "e4", title: "4. じゃあ" }],
  8: [{ page: "101", id: "e4", title: "4. 电话／传真／邮件をもらいます" }, { page: "101", id: "e5", title: "5. スケジュール表の件" }],
  9: [{ page: "117", id: "e2", title: "2. 子供用" }],
  10: [{ page: "127", id: "e2", title: "2. おとといは雨でした" }],
  14: [{ page: "173", id: "e2", title: "2. 買い物します" }],
  15: [{ page: "183", id: "e2", title: "2. ボートに乗ります" }, { page: "184", id: "e6", title: "6. ～" }],
  16: [{ page: "193", id: "e1", title: "1. 背が高くて脚が長くて" }, { page: "193", id: "e2", title: "2. 入場料" }, { page: "193", id: "e3", title: "3. 外来語②" }],
  18: [{ page: "219", id: "e3", title: "3. 3割引" }],
  21: [{ page: "255", id: "e2", title: "2. 連休" }],
  27: [{ page: "27", id: "e1", title: "1. アルバイト" }],
  30: [{ page: "63", id: "e6", title: "6. 自言自语时的“な”" }],
  32: [{ page: "83", id: "e2", title: "2. ボーナス" }],
  37: [{ page: "145", id: "e1", title: "1. 条件表达方式小结" }, { page: "145", id: "e2", title: "2. ～たら和～ば" }, { page: "145", id: "e3", title: "3. ～と" }, { page: "145", id: "e4", title: "4. ～なら" }],
  43: [{ page: "211", id: "e1", title: "1. お手伝い" }],
};

for (const [lesson, addition] of Object.entries(additions)) {
  const path = `data/ocr/lesson${lesson}-grammar-examples.json`;
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  const page = data.pages[addition.page] ||= { groups: [] };
  if (!page.groups.some((group) => group.id === addition.id)) {
    page.groups.unshift({ id: addition.id, title: addition.title, examples: [] });
  }
  fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

for (const [lesson, items] of Object.entries(expressionAdditions)) {
  const path = `data/ocr/lesson${lesson}-grammar-examples.json`;
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  for (const item of items) {
    const page = data.pages[item.page] ||= { groups: [] };
    if (!page.groups.some((group) => group.title === item.title)) {
      page.groups.push({ id: item.id, title: item.title, examples: [] });
    }
  }
  for (const item of items) {
    const groups = data.pages[item.page]?.groups || [];
    groups.sort((a, b) => {
      const an = Number(String(a.title || "").match(/^\s*(\d+)/)?.[1] || 999);
      const bn = Number(String(b.title || "").match(/^\s*(\d+)/)?.[1] || 999);
      return an - bn;
    });
  }
  fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}
