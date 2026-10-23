/* ======================================================================
   站点内容数据文件 — 添加新闻 / 小组活动，只需要编辑本文件，不用新建任何页面！

   使用方法：
   1. 实验室动态加到 "news" 数组，小组活动加到 "life" 数组，
      直接复制一对 { ... }, 粘贴后修改内容即可；
   2. date 日期格式 YYYY-MM-DD，页面会自动按日期从新到旧排序；
   3. title 标题必填；text 是列表页显示的一句话简介，可留空 ""；
   4. body 是详情页正文：一个数组，每个字符串是一段（点击首页/News 页
      的条目会进入 detail.html 详情页显示这些内容）；
   5. image 可选：详情页顶部大图，填照片路径如 "./statics/picture/xxx.jpg"；
   6. link 可选：相关链接（论文、新闻稿、更多照片等），留空 "" 则不显示按钮；
   7. id 可选：自定义详情页链接编号（如 "outing2026"），
      不填会自动生成（news-日期-序号）。

   示例：
   {
     date: "2026-10-01",
     title: "论文被 Nature 接收",
     text: "……（列表页一句话）",
     body: ["第一段正文……", "第二段正文……"],
     image: "",
     link: "",
     id: ""
   },
   ====================================================================== */

var SITE_DATA = {

  /* —— 实验室动态（首页 Latest News + News 页 + 详情页）—— */
  news: [
    {
      date: "2026-08-21",
      title: "Our YTHDC1 study is published in Nature Communications",
      text: "YTHDC1 functions as a molecular chaperone to suppress ALS-linked hnRNPA1 mutants from aggregation.",
      body: [
        "Our study \"YTHDC1 functions as a molecular chaperone to suppress ALS-linked hnRNPA1 mutants from aggregation\" was published in Nature Communications on 21 August 2026.",
        "In this work, we identify the m6A-binding protein YTHDC1 as an ATP-independent molecular chaperone. YTHDC1 suppresses ALS-linked hnRNPA1 mutants from aggregation through its acidic polyD/E segment, independent of m6A recognition, highlighting its chaperone activity as a potential target for mitigating protein aggregation in ALS-related neurodegenerative disorders.",
        "Kang Ren is the first author of this study."
      ],
      image: "",
      link: "https://www.nature.com/articles/s41467-026-77016-y",
      id: ""
    },
    {
      date: "2026-06-22",
      title: "Huge congratulations to Yanfei Chen & Yun Liu on graduating!",
      text: "Wishing them all the best in their future careers.",
      body: [
        "Yanfei Chen and Yun Liu have completed their studies and graduated from the lab.",
        "Huge congratulations to both of them — we are proud of everything they have achieved here, and we wish them all the best in their future careers."
      ],
      image: "",
      link: "",
      id: ""
    },
    {
      date: "2026-04-20",
      title: "Laboratory Safety Training",
      text: "The lab held its routine laboratory safety training session.",
      body: [
        "The lab held its routine laboratory safety training session.",
        "All lab members attended and reviewed everyday safe work practices in the lab."
      ],
      image: "",
      link: "",
      id: ""
    },
    {
      date: "2026-04-10",
      title: "Our lab website is now live!",
      text: "Explore our research, publications, team, and latest news at pqc-huanglab.com.",
      body: [
        "Our lab website is now online at pqc-huanglab.com.",
        "You can find information about our research, publications, team members, and the latest news of the lab. We will keep the site updated with new publications and group activities."
      ],
      image: "",
      link: "",
      id: ""
    }
  ],

  /* —— 小组生活（首页 Group Life + Group Life 页 + 详情页）—— */
  life: [
    {
      date: "2026-03-15",
      title: "2026 Spring Outing",
      text: "The lab enjoyed its 2026 spring outing together.",
      body: [
        "The lab enjoyed its 2026 spring outing together — a relaxing day outdoors with the whole group.",
        "More photos coming soon."
      ],
      image: "",
      link: "",
      id: ""
    }
  ]

};
