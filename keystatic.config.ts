import { collection, config, fields, singleton } from "@keystatic/core";
import { COURSE_STATUSES } from "@/lib/course-status";
import { FORMAT_OPTIONS } from "@/lib/formats";

const useGithub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

const storage = useGithub
  ? { kind: "github" as const, repo: "salmanbahaev/djawda" as const }
  : { kind: "local" as const };

const textList = (label: string, description?: string) =>
  fields.array(fields.text({ label: "Пункт", validation: { isRequired: true } }), {
    label,
    description,
    itemLabel: (props) => props.value || "Пункт",
  });

export default config({
  storage,
  locale: "ru-RU",
  ui: {
    brand: { name: "Джавда" },
    navigation: {
      Страницы: ["home", "about", "contactsPage", "privacy"],
      Сайт: ["settings", "form", "footer"],
      Курсы: ["courses"],
    },
  },
  singletons: {
    settings: singleton({
      label: "Настройки сайта",
      path: "content/settings",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        siteUrl: fields.text({
          label: "Адрес сайта",
          defaultValue: "https://djawda.vercel.app",
          validation: { isRequired: true },
        }),
        wordmark: fields.text({
          label: "Словесный знак латиницей",
          description: "Рисуется живым текстом рядом со знаком, не картинкой.",
          defaultValue: "Djawda",
          validation: { isRequired: true },
        }),
        wordmarkRu: fields.text({
          label: "Словесный знак по-русски",
          defaultValue: "Джавда",
          validation: { isRequired: true },
        }),
        logo: fields.image({
          label: "Каллиграфический знак",
          description:
            "Только знак над словом, файл SVG. На сайте у него серебряный градиент; в шапке тот же файл рисуется плоским серебром.",
          directory: "public/brand",
          publicPath: "/brand/",
        }),
        logoAlt: fields.text({ label: "Подпись знака для экрана", defaultValue: "" }),
        ogImage: fields.image({
          label: "Картинка для соцсетей",
          directory: "public/brand",
          publicPath: "/brand/",
        }),
        ogImageAlt: fields.text({ label: "Подпись картинки для соцсетей", defaultValue: "" }),
        defaultSeoTitle: fields.text({
          label: "Заголовок сайта по умолчанию",
          validation: { isRequired: true },
        }),
        defaultSeoDescription: fields.text({
          label: "Описание сайта по умолчанию",
          multiline: true,
          validation: { isRequired: true },
        }),
        phoneDisplay: fields.text({
          label: "Телефон как на сайте",
          validation: { isRequired: true },
        }),
        whatsappUrl: fields.url({ label: "Ссылка WhatsApp", validation: { isRequired: true } }),
        telegramUrl: fields.url({ label: "Ссылка Telegram", validation: { isRequired: true } }),
        instagramUrl: fields.url({ label: "Ссылка Instagram", validation: { isRequired: true } }),
        telegramLabel: fields.text({ label: "Подпись Telegram", validation: { isRequired: true } }),
        instagramLabel: fields.text({
          label: "Подпись Instagram",
          validation: { isRequired: true },
        }),
        address: fields.text({ label: "Адрес", validation: { isRequired: true } }),
        mapUrl: fields.url({ label: "Ссылка на карту 2ГИС", validation: { isRequired: true } }),
        mapImage: fields.image({
          label: "Снимок карты 2ГИС",
          description:
            "Картинка в блоке контактов. Клик открывает ту же точку в 2ГИС. Виджет firmsonmap для geo-id из ТЗ отдаёт ошибку, поэтому на сайте снимок.",
          directory: "public/images",
          publicPath: "/images/",
        }),
        mapImageAlt: fields.text({ label: "Подпись карты" }),
        mapEmbedUrl: fields.url({
          label: "Запасная ссылка iframe",
          description:
            "Используется, только если снимка нет. Конструктор 2ГИС можно подставить сюда, когда выдаст рабочий виджет.",
          validation: { isRequired: true },
        }),
        routeUrl: fields.url({
          label: "Ссылка «Построить маршрут»",
          validation: { isRequired: true },
        }),
        routeLabel: fields.text({
          label: "Текст кнопки маршрута",
          validation: { isRequired: true },
        }),
        mapLinkLabel: fields.text({
          label: "Текст ссылки на карту",
          validation: { isRequired: true },
        }),
        nav: fields.array(
          fields.object({
            label: fields.text({ label: "Подпись", validation: { isRequired: true } }),
            href: fields.text({
              label: "Якорь",
              description: "Например #courses. Ведёт на блок той же страницы.",
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Пункты меню",
            itemLabel: (props) => props.fields.label.value || "Пункт",
          },
        ),
        navCta: fields.text({ label: "Кнопка в меню", validation: { isRequired: true } }),
        audienceNote: fields.text({
          label: "Короткая строка об аудитории",
          description: "Например в первом экране.",
          validation: { isRequired: true },
        }),
      },
    }),
    home: singleton({
      label: "Главная",
      path: "content/home",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        seoTitle: fields.text({ label: "SEO-заголовок", validation: { isRequired: true } }),
        seoDescription: fields.text({
          label: "SEO-описание",
          multiline: true,
          validation: { isRequired: true },
        }),
        heroTitle: fields.text({
          label: "Заголовок первого экрана",
          validation: { isRequired: true },
        }),
        heroSubtitle: fields.text({
          label: "Подзаголовок",
          multiline: true,
          validation: { isRequired: true },
        }),
        heroPrimaryLabel: fields.text({ label: "Кнопка 1", validation: { isRequired: true } }),
        heroPrimaryHref: fields.text({
          label: "Ссылка кнопки 1",
          validation: { isRequired: true },
        }),
        heroSecondaryLabel: fields.text({ label: "Кнопка 2", validation: { isRequired: true } }),
        heroSecondaryHref: fields.text({
          label: "Ссылка кнопки 2",
          validation: { isRequired: true },
        }),
        approachEyebrow: fields.text({
          label: "Подход: надзаголовок",
          validation: { isRequired: true },
        }),
        approachTitle: fields.text({
          label: "Подход: заголовок",
          validation: { isRequired: true },
        }),
        approachText: fields.text({
          label: "Подход: текст",
          multiline: true,
          validation: { isRequired: true },
        }),
        approachSteps: fields.array(
          fields.object({
            title: fields.text({ label: "Шаг", validation: { isRequired: true } }),
            text: fields.text({
              label: "Пояснение",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Шаги подхода",
            itemLabel: (props) => props.fields.title.value || "Шаг",
          },
        ),
        audienceEyebrow: fields.text({
          label: "Кому подойдёт: надзаголовок",
          validation: { isRequired: true },
        }),
        audienceTitle: fields.text({
          label: "Кому подойдёт: заголовок",
          validation: { isRequired: true },
        }),
        audienceItems: fields.array(
          fields.object({
            title: fields.text({ label: "Заголовок", validation: { isRequired: true } }),
            text: fields.text({
              label: "Текст",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Кому подойдёт",
            itemLabel: (props) => props.fields.title.value || "Пункт",
          },
        ),
        catalogEyebrow: fields.text({
          label: "Каталог: надзаголовок",
          validation: { isRequired: true },
        }),
        catalogTitle: fields.text({
          label: "Каталог: заголовок",
          validation: { isRequired: true },
        }),
        catalogLead: fields.text({
          label: "Каталог: вступление",
          multiline: true,
          validation: { isRequired: true },
        }),
        courseLinkLabel: fields.text({
          label: "Кнопка раскрытия курса",
          validation: { isRequired: true },
        }),
        courseCloseLabel: fields.text({
          label: "Кнопка сворачивания курса",
          validation: { isRequired: true },
        }),
        courseRequestLabel: fields.text({
          label: "Кнопка заявки внутри курса",
          validation: { isRequired: true },
        }),
        teachersEyebrow: fields.text({
          label: "Преподаватели: надзаголовок",
          validation: { isRequired: true },
        }),
        teachersTitle: fields.text({
          label: "Преподаватели: заголовок",
          validation: { isRequired: true },
        }),
        teachersLead: fields.text({ label: "Преподаватели: вступление", multiline: true }),
        formatsEyebrow: fields.text({
          label: "Форматы: надзаголовок",
          validation: { isRequired: true },
        }),
        formatsTitle: fields.text({
          label: "Форматы: заголовок",
          validation: { isRequired: true },
        }),
        formatsLead: fields.text({
          label: "Форматы: вступление",
          multiline: true,
          validation: { isRequired: true },
        }),
        formats: fields.array(
          fields.object({
            title: fields.text({ label: "Заголовок", validation: { isRequired: true } }),
            text: fields.text({
              label: "Текст",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Карточки форматов",
            itemLabel: (props) => props.fields.title.value || "Формат",
          },
        ),
        enrollmentTitle: fields.text({
          label: "Как проходит запись: заголовок",
          validation: { isRequired: true },
        }),
        enrollmentSteps: textList("Шаги записи"),
        faqEyebrow: fields.text({ label: "FAQ: надзаголовок", validation: { isRequired: true } }),
        faqTitle: fields.text({ label: "FAQ: заголовок", validation: { isRequired: true } }),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: "Вопрос", validation: { isRequired: true } }),
            answer: fields.text({
              label: "Ответ",
              multiline: true,
              validation: { isRequired: true },
            }),
            draft: fields.checkbox({
              label: "Черновик",
              description: "Ответ собран по ТЗ и ждёт проверки. На сайте галочка не показывается.",
              defaultValue: true,
            }),
          }),
          {
            label: "Вопросы и ответы",
            description:
              "Черновики опубликованы, чтобы страница не была пустой. Снимите галочку после проверки.",
            itemLabel: (props) => props.fields.question.value || "Вопрос",
          },
        ),
        contactsEyebrow: fields.text({
          label: "Контакты: надзаголовок",
          validation: { isRequired: true },
        }),
        contactsTitle: fields.text({
          label: "Контакты: заголовок",
          validation: { isRequired: true },
        }),
        contactsLead: fields.text({
          label: "Контакты: текст",
          multiline: true,
          validation: { isRequired: true },
        }),
        finalEyebrow: fields.text({
          label: "Финальный блок: надзаголовок",
          validation: { isRequired: true },
        }),
        finalTitle: fields.text({
          label: "Финальный блок: заголовок",
          validation: { isRequired: true },
        }),
        finalText: fields.text({
          label: "Финальный блок: текст",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
    about: singleton({
      label: "О школе",
      path: "content/about",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        seoTitle: fields.text({ label: "SEO-заголовок", validation: { isRequired: true } }),
        seoDescription: fields.text({
          label: "SEO-описание",
          multiline: true,
          validation: { isRequired: true },
        }),
        eyebrow: fields.text({
          label: "Надзаголовок",
          description:
            "Текст показывается на главной в блоке преподавателей. Отдельной страницы нет.",
          validation: { isRequired: true },
        }),
        title: fields.text({ label: "Заголовок", validation: { isRequired: true } }),
        lead: fields.text({ label: "Лид", multiline: true, validation: { isRequired: true } }),
        story: fields.text({
          label: "Текст о школе",
          multiline: true,
          description: "Абзацы разделяйте пустой строкой.",
          validation: { isRequired: true },
        }),
        principlesTitle: fields.text({
          label: "Принципы: заголовок",
          validation: { isRequired: true },
        }),
        principles: fields.array(
          fields.object({
            title: fields.text({ label: "Заголовок", validation: { isRequired: true } }),
            text: fields.text({
              label: "Текст",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          { label: "Принципы", itemLabel: (props) => props.fields.title.value || "Принцип" },
        ),
        teachersTitle: fields.text({
          label: "Преподаватели: заголовок",
          validation: { isRequired: true },
        }),
        teachersLead: fields.text({ label: "Преподаватели: вступление", multiline: true }),
        teachers: fields.array(
          fields.object({
            name: fields.text({ label: "Имя", validation: { isRequired: true } }),
            lines: textList("Факты"),
          }),
          {
            label: "Преподаватели",
            description: "Только текст, без фотографий.",
            itemLabel: (props) => props.fields.name.value || "Преподаватель",
          },
        ),
      },
    }),
    contactsPage: singleton({
      label: "Страница контактов",
      path: "content/contacts-page",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        seoTitle: fields.text({ label: "SEO-заголовок", validation: { isRequired: true } }),
        seoDescription: fields.text({
          label: "SEO-описание",
          multiline: true,
          validation: { isRequired: true },
        }),
        eyebrow: fields.text({ label: "Надзаголовок", validation: { isRequired: true } }),
        title: fields.text({ label: "Заголовок", validation: { isRequired: true } }),
        lead: fields.text({
          label: "Текст",
          multiline: true,
          description:
            "Запись оставлена в админке. На сайте блок контактов берётся из «Главной» и настроек.",
          validation: { isRequired: true },
        }),
        formTitle: fields.text({ label: "Заголовок формы", validation: { isRequired: true } }),
        formText: fields.text({
          label: "Текст у формы",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
    form: singleton({
      label: "Форма заявки",
      path: "content/form",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        nameLabel: fields.text({ label: "Имя и фамилия", validation: { isRequired: true } }),
        phoneLabel: fields.text({ label: "Номер WhatsApp", validation: { isRequired: true } }),
        courseLabel: fields.text({ label: "Интересующий курс", validation: { isRequired: true } }),
        coursePlaceholder: fields.text({
          label: "Пустой пункт списка курсов",
          validation: { isRequired: true },
        }),
        formatLabel: fields.text({ label: "Формат", validation: { isRequired: true } }),
        formats: fields.array(
          fields.object({
            value: fields.select({
              label: "Значение",
              options: FORMAT_OPTIONS.map((item) => ({ label: item.label, value: item.value })),
              defaultValue: "online",
            }),
            label: fields.text({ label: "Подпись на сайте", validation: { isRequired: true } }),
          }),
          {
            label: "Варианты формата",
            description:
              "Значения online / offline / undecided лучше не дублировать: по ним форма понимает ответ.",
            itemLabel: (props) => props.fields.label.value || "Формат",
          },
        ),
        consentLabel: fields.text({ label: "Текст согласия", validation: { isRequired: true } }),
        privacyLinkLabel: fields.text({
          label: "Текст ссылки на политику",
          validation: { isRequired: true },
        }),
        hint: fields.text({ label: "Подсказка под формой", validation: { isRequired: true } }),
        submitLabel: fields.text({ label: "Кнопка отправки", validation: { isRequired: true } }),
        submittingLabel: fields.text({
          label: "Кнопка во время отправки",
          validation: { isRequired: true },
        }),
        whatsappCta: fields.text({ label: "Кнопка WhatsApp", validation: { isRequired: true } }),
        successTitle: fields.text({ label: "Заголовок успеха", validation: { isRequired: true } }),
        successText: fields.text({
          label: "Текст успеха",
          multiline: true,
          validation: { isRequired: true },
        }),
        errorText: fields.text({
          label: "Общая ошибка",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
    footer: singleton({
      label: "Подвал",
      path: "content/footer",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        blurb: fields.text({
          label: "Короткий текст",
          multiline: true,
          validation: { isRequired: true },
        }),
        privacyLabel: fields.text({
          label: "Ссылка на политику",
          validation: { isRequired: true },
        }),
        rights: fields.text({ label: "Строка внизу", validation: { isRequired: true } }),
      },
    }),
    privacy: singleton({
      label: "Политика конфиденциальности",
      path: "content/privacy",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        seoTitle: fields.text({ label: "SEO-заголовок", validation: { isRequired: true } }),
        seoDescription: fields.text({
          label: "SEO-описание",
          multiline: true,
          validation: { isRequired: true },
        }),
        title: fields.text({ label: "Заголовок", validation: { isRequired: true } }),
        notice: fields.text({
          label: "Пометка о черновике",
          multiline: true,
          description: "Показывается над текстом, пока политика не заменена настоящей.",
          validation: { isRequired: true },
        }),
        body: fields.text({
          label: "Текст",
          multiline: true,
          description: "Абзацы разделяйте пустой строкой. Это заглушка, её нужно заменить.",
          validation: { isRequired: true },
        }),
      },
    }),
  },
  collections: {
    courses: collection({
      label: "Курсы",
      slugField: "title",
      path: "content/courses/*",
      format: { data: "json" },
      entryLayout: "form",
      previewUrl: "/#course-{slug}",
      columns: ["title", "status", "priceText", "order"],
      schema: {
        title: fields.slug({
          name: { label: "Название", validation: { isRequired: true } },
          slug: {
            label: "Якорь",
            description:
              "Латиница через дефис. На главной это #course-этот-якорь. После публикации лучше не менять.",
          },
        }),
        shortDescription: fields.text({
          label: "Краткое описание для карточки",
          multiline: true,
          validation: { isRequired: true },
        }),
        subtitle: fields.text({
          label: "Подзаголовок в раскрытой карточке",
          multiline: true,
          validation: { isRequired: true },
        }),
        formats: fields.text({ label: "Форматы", validation: { isRequired: true } }),
        duration: fields.text({ label: "Длительность", validation: { isRequired: true } }),
        groupSize: fields.text({ label: "Размер группы", description: "Можно оставить пустым." }),
        priceText: fields.text({
          label: "Стоимость",
          description:
            "Эта строка на карточке. Если сумма повторяется в тексте раздела, обновите и её.",
          validation: { isRequired: true },
        }),
        status: fields.select({
          label: "Статус набора",
          description: "Новые значения добавляются в lib/course-status.ts.",
          options: COURSE_STATUSES.map((item) => ({ label: item.label, value: item.value })),
          defaultValue: "soon",
        }),
        order: fields.integer({
          label: "Порядок на главной",
          defaultValue: 1,
          validation: { isRequired: true, min: 1 },
        }),
        cardImage: fields.image({
          label: "Картинка карточки",
          description: "Необязательно. Фото кабинета не используем.",
          directory: "public/images/courses",
          publicPath: "/images/courses/",
        }),
        cardImageAlt: fields.text({ label: "Подпись картинки карточки" }),
        materialsImage: fields.image({
          label: "Изображение в разделе материалов",
          description:
            "Показывается в разделе с якорем materials. Для «Таджвид с нуля» — фото пособий.",
          directory: "public/images/courses",
          publicPath: "/images/courses/",
        }),
        materialsImageAlt: fields.text({ label: "Подпись изображения материалов" }),
        sections: fields.array(
          fields.object({
            id: fields.text({
              label: "Якорь",
              description: "materials — сюда встанет фото материалов. Латиница, без пробелов.",
            }),
            title: fields.text({ label: "Заголовок", validation: { isRequired: true } }),
            body: fields.text({
              label: "Текст",
              multiline: true,
              description: "Абзацы разделяйте пустой строкой.",
            }),
            items: textList("Список"),
            note: fields.text({ label: "Примечание", multiline: true }),
          }),
          {
            label: "Разделы карточки",
            itemLabel: (props) => props.fields.title.value || "Раздел",
          },
        ),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: "Вопрос", validation: { isRequired: true } }),
            answer: fields.text({
              label: "Ответ",
              multiline: true,
              validation: { isRequired: true },
            }),
            draft: fields.checkbox({
              label: "Черновик",
              description: "Ответ собран по ТЗ и требует проверки. На сайте пометка не выводится.",
              defaultValue: true,
            }),
          }),
          {
            label: "Вопросы и ответы",
            itemLabel: (props) => props.fields.question.value || "Вопрос",
          },
        ),
        seoTitle: fields.text({ label: "SEO-заголовок", validation: { isRequired: true } }),
        seoDescription: fields.text({
          label: "SEO-описание",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
});
