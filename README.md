# Sherry Feng · JD TGT

冯晓晴（Sherry Feng）的个人招聘主页，介绍京东科技与探索研究院 TGT 计划、JoyAI 研究成果及开放课题。

- 主页：<https://sherryfeng2012.github.io>
- TGT：<https://sherryfeng2012.github.io/about-tgt/>

网站使用原生 HTML、CSS 和 JavaScript 构建，通过 GitHub Pages 发布。

## 维护 TGT 课题

所有课题集中保存在根目录的 `positions-data.js`。每个课题是一条对象数据：

```js
{ cohort: "graduate", org: "institute", field: "具身智能", title: "课题名称", id: 8726 },
```

- `cohort`：`graduate` 为应届生，`intern` 为实习生。
- `org`：`institute` 为探索研究院，`technology` 为京东科技。
- `field`：页面筛选标签，例如 `具身智能`、`多模态`、`AI Infra`。
- `title`：页面显示的课题名称。
- `id`：京东招聘链接末尾的职位编号。

直接在 GitHub 仓库打开 `positions-data.js`，点击右上角铅笔图标即可新增、修改或删除。修改后点击 **Commit changes**，通常 1–3 分钟后网站自动更新。新增时复制一整行并修改内容；删除时删掉对应整行，注意保留每行末尾的英文逗号。

页面默认显示应届生课题；`cohort: "intern"` 的课题需要切换到“实习生投递课题”查看。课题较多时可直接搜索标题，或使用方向、团队筛选。
