# 网站维护指南

这个网站通过 GitHub Pages 自动发布。日常更新只需要修改配置文件或上传图片，不需要在本地安装开发环境。

## 一、在 GitHub 网页端提交修改

1. 打开仓库 `SherryFeng2012/SherryFeng2012.github.io`。
2. 点击需要修改的文件。
3. 点击文件右上角的铅笔按钮 **Edit this file**。
4. 修改内容后点击 **Commit changes...**。
5. 选择直接提交到 `main`，再次点击 **Commit changes**。
6. 打开仓库的 **Actions** 页面，等待 `pages build and deployment` 显示绿色对勾。
7. 部署通常需要 1–3 分钟，完成后刷新网站。

## 二、修改主页和 TGT 文案

常用文字与链接集中在根目录的 `site-config.js`，只修改英文双引号中的内容，不要修改左侧字段名、引号或逗号。

### 主页内容

在 `home` 中修改：

- `photo`：头像文件路径。
- `photoAlt`：头像说明。
- `nameChinese`、`nameEnglish`：中英文姓名。
- `organization`：部门名称。
- `role`：职位名称。
- `summary`：个人简介。
- `primaryAction`、`contactAction`：按钮文字。

### TGT 页面内容

在 `about` 中修改：

- `hero`：首屏标题、简介、统计项名称和按钮文字。
- `mission`：使命区域文字。
- `work`：成果区域标题与按钮文字。
- `positions`：课题区域标题、说明、筛选和搜索文字。
- `contact`：底部联系区域文字。

### 链接

在 `links` 中修改邮箱、JoyAI 研究门户、模型项目、论文和校园招聘链接。邮箱必须保留 `mailto:` 前缀，例如：

```js
email: "mailto:fengxiaojing.sherry@jd.com",
```

## 三、维护 About Me 页面

个人介绍页地址为 `/about-me/`，内容集中在 `site-config.js` 的 `aboutMe` 中。目前未知信息统一使用 `xxxx` 占位。

- `subtitle`：姓名下方的一句话介绍。
- `mission`：个人使命标题和说明。
- `experience.items`：工作经历列表。
- `education.items`：教育经历列表。
- `contact.items`：联系方式列表。

新增工作经历时，复制 `experience.items` 中从 `{` 到 `},` 的完整一段，粘贴后修改：

```js
{
  period: "xxxx",
  company: "xxxx",
  title: "xxxx",
  description: "xxxx",
  tags: ["xxxx", "xxxx"],
},
```

教育经历和联系方式也采用同样方式增删。联系方式的 `href` 留空时只展示文字；填写 `mailto:` 或 `https://` 链接后，卡片可以点击。

## 四、更换主页头像

推荐上传新的文件名，避免浏览器继续显示旧图片：

1. 在仓库中打开 `assets` 文件夹。
2. 点击 **Add file → Upload files**。
3. 上传 JPG、PNG 或 WebP 图片，例如 `sherry-feng-2027.jpg`。
4. 提交图片。
5. 打开 `site-config.js`，把 `home.photo` 改为 `/assets/sherry-feng-2027.jpg`。
6. 同时更新 `home.photoAlt`，然后提交。

建议使用清晰的正方形照片，尺寸至少为 600 × 600 像素，人物尽量位于中央。

## 五、维护 TGT 课题

所有课题保存在根目录的 `positions-data.js`。每条数据格式如下：

```js
{ cohort: "graduate", org: "institute", field: "具身智能", title: "课题名称", id: 8726 },
```

- `cohort`：`graduate` 表示应届生，`intern` 表示实习生。
- `org`：`institute` 表示探索研究院，`technology` 表示京东科技。
- `field`：研究方向，例如 `具身智能`、`多模态`、`AI Infra`。
- `title`：页面显示的课题名称。
- `id`：京东校园招聘详情页链接中的职位编号。

新增课题时复制一整行，粘贴到数组末尾的 `];` 之前，再修改五个字段。删除课题时删除对应整行。每行末尾保留英文逗号。

方向标签会根据当前选择的招聘类型和团队自动生成；该组合下没有岗位的方向不会显示。新增一个全新 `field` 后，页面会自动增加对应标签。

页面默认显示应届生课题。实习生课题需要切换到“实习生课题”查看；课题较多时可搜索标题或翻页。

## 六、修改模型与论文

- 模型和论文的跳转地址在 `site-config.js` 的 `links` 中修改。
- 模型和论文的名称、简介及图片仍在 `about-tgt/index.html` 中修改。
- 图片文件统一放在 `assets/research` 文件夹。

## 七、检查与恢复

- 如果页面没有立即更新，先确认 **Actions** 已完成，再强制刷新浏览器。
- 如果页面内容消失，优先检查上一行末尾是否缺少逗号、英文引号是否成对。
- 如果改错，可以在文件页面点击 **History**，打开上一个正确版本后执行 **Revert**。
- 不要在任何网页文件中填写账号密码、Cookie、访问令牌或其他敏感信息。
