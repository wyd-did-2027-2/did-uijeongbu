export type Locale = "kr" | "en";
export const locales: Locale[] = ["kr", "en"];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const content = {
  kr: {
    lang: "ko",
    metadata: {
      title: "WYD SEOUL 2027 DID 의정부",
      description: "WYD SEOUL 2027 DID 의정부 공식 웹사이트",
      ogLocale: "ko_KR",
    },
    header: {
      logoAlt: "wyd did 의정부 로고",
      nav: {
        home: "홈",
        calendar: "캘린더",
        youtube: "영상",
        notice: "공지",
        site: "사이트",
        faq: "FAQ",
      },
    },
    footer: {
      logoAlt: "wyd did 의정부 로고",
      address:
        "경기도 의정부시 신흥로 261 WYD 의정부 교구대회 사무국",
      email: "qna.wyd.doc.icn@gmail.com",
      phone: "032-765-6997",
      hours: "운영시간: 10:00 ~ 18:00",
      copyright: "Copyright ⓒ 의정부교구 All rights reserved",
    },
    slider: {
      pause: "일시정지 버튼",
      play: "재생 버튼",
      prev: "이전 슬라이드 버튼",
      next: "다음 슬라이드 버튼",
    },
    sections: {
      calendar: "CALENDAR",
      notice: "공지사항",
      youtube: "추천 영상",
      site: "관련 사이트",
      faq: "FAQ",
    },
    notice: {
      backLink: "돌아가기",
    },
    common: {
      prev: "이전",
      next: "다음",
      prevPage: "이전 페이지",
      nextPage: "다음 페이지",
      backToTop: "맨 위로 이동",
      close: "닫기",
      hideFor7Days: "7일간 보지 않기",
    },
    popup: {
      title: "2026 세계청년대회 안내",
      description:
        "의정부교구에서 준비하는 세계청년대회 소식을 확인해보세요.",
    },
  },
  en: {
    lang: "en",
    metadata: {
      title: "WYD SEOUL 2027 DID Uijeongbu",
      description: "WYD SEOUL 2027 DID Uijeongbu Official Website",
      ogLocale: "en_US",
    },
    header: {
      logoAlt: "wyd did Uijeongbu logo",
      nav: {
        home: "Home",
        calendar: "Calendar",
        youtube: "Videos",
        notice: "Notice",
        site: "Sites",
        faq: "FAQ",
      },
    },
    footer: {
      logoAlt: "wyd did Uijeongbu logo",
      address:
        "261, Sinheung-ro, Uijeongbu-si, Gyeonggi-do, WYD Uijeongbu Diocesan Committee",
      email: "qna.wyd.doc.icn@gmail.com",
      phone: "032-765-6997",
      hours: "Hours: 10:00 ~ 18:00",
      copyright: "Copyright ⓒ Diocese of Uijeongbu All rights reserved",
    },
    slider: {
      pause: "Pause",
      play: "Play",
      prev: "Previous slide",
      next: "Next slide",
    },
    sections: {
      calendar: "CALENDAR",
      notice: "Notice",
      youtube: "Featured Videos",
      site: "Related Sites",
      faq: "FAQ",
    },
    notice: {
      backLink: "Go back",
    },
    common: {
      prev: "Previous",
      next: "Next",
      prevPage: "Previous page",
      nextPage: "Next page",
      backToTop: "Back to top",
      close: "Close",
      hideFor7Days: "Hide for 7 days",
    },
    popup: {
      title: "WYD 2026 Information",
      description:
        "Check out the latest news about WYD from the Diocese of Uijeongbu.",
    },
  },
} as const;

export type Content = (typeof content)["kr"];
