// 다국어 번역 데이터
export const translations = {
  ko: {
    // 공통
    common: {
      appName: 'ThreadClip',
      tagline: '쓰레드 아카이브 & 검색',
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      edit: '편집',
      search: '검색',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      success: '성공!',
      confirm: '확인',
      back: '뒤로',
    },
    // 인증
    auth: {
      login: '로그인',
      logout: '로그아웃',
      loginWithGoogle: 'Google로 로그인',
      loginTitle: '시작하기',
      loginSubtitle: '쓰레드 게시물을 저장하고 검색하세요',
      welcomeBack: '다시 오신 것을 환영합니다!',
    },
    // 홈/메인
    home: {
      title: '저장된 쓰레드',
      empty: '아직 저장된 쓰레드가 없습니다',
      emptySubtitle: 'Threads 링크를 붙여넣어 첫 게시물을 저장해보세요',
      noResults: '검색 결과가 없습니다',
      noResultsSubtitle: '다른 검색어로 다시 시도해보세요',
      addNew: '새 쓰레드 저장',
      searchPlaceholder: '저장된 쓰레드 검색...',
      sortBy: '정렬',
      sortNewest: '최신순',
      sortOldest: '오래된순',
      viewOriginal: '원본 보기',
    },
    // 쓰레드 저장
    thread: {
      saveTitle: '쓰레드 저장',
      urlPlaceholder: 'Threads 링크를 붙여넣으세요',
      urlLabel: 'Threads URL',
      urlHint: '예: https://threads.net/@username/post/xxxxx',
      memoLabel: '메모 (검색용)',
      memoPlaceholder: '이 게시물에 대한 메모를 입력하세요. 나중에 검색할 때 사용됩니다.',
      memoHint: '💡 키워드, 요약, 기억하고 싶은 내용 등을 입력하세요',
      saving: '저장 중...',
      saved: '저장되었습니다!',
      alreadySaved: '이미 저장된 쓰레드입니다',
      invalidUrl: '유효한 Threads 링크가 아닙니다',
      invalidOrInaccessible: '링크를 확인할 수 없습니다. 삭제되었거나 비공개 게시물일 수 있습니다.',
      deleteConfirm: '이 쓰레드를 삭제하시겠습니까?',
      maxReached: '저장 한도(200개)에 도달했습니다',
    },
    // 태그
    tag: {
      tags: '태그',
      addTag: '태그 추가',
      newTag: '새 태그',
      tagName: '태그 이름',
      tagColor: '태그 색상',
      noTags: '태그가 없습니다',
      manageTags: '태그 관리',
      deleteTagConfirm: '이 태그를 삭제하시겠습니까?',
    },
    // 설정
    settings: {
      title: '설정',
      language: '언어',
      theme: '테마',
      themeLight: '라이트',
      themeDark: '다크',
      themeSystem: '시스템 설정',
      account: '계정',
      deleteAccount: '계정 삭제',
      deleteAccountConfirm: '정말로 계정을 삭제하시겠습니까? 모든 데이터가 삭제됩니다.',
    },
    // PWA
    pwa: {
      installTitle: '앱 설치하기',
      installDescription: '홈 화면에 추가하여 더 빠르게 접근하세요',
      install: '설치',
      notNow: '나중에',
      shareTargetSaving: '저장 중...',
      shareTargetSuccess: '저장 완료!',
      shareTargetError: 'Threads 링크만 저장할 수 있습니다',
    },
  },
  en: {
    // Common
    common: {
      appName: 'ThreadClip',
      tagline: 'Thread Archive & Search',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
      confirm: 'Confirm',
      back: 'Back',
    },
    // Auth
    auth: {
      login: 'Log in',
      logout: 'Log out',
      loginWithGoogle: 'Continue with Google',
      loginTitle: 'Get Started',
      loginSubtitle: 'Save and search your favorite Threads posts',
      welcomeBack: 'Welcome back!',
    },
    // Home/Main
    home: {
      title: 'Saved Threads',
      empty: 'No saved threads yet',
      emptySubtitle: 'Paste a Threads link to save your first post',
      noResults: 'No results found',
      noResultsSubtitle: 'Try using different keywords',
      addNew: 'Save New Thread',
      searchPlaceholder: 'Search saved threads...',
      sortBy: 'Sort by',
      sortNewest: 'Newest',
      sortOldest: 'Oldest',
      viewOriginal: 'View Original',
    },
    // Thread saving
    thread: {
      saveTitle: 'Save Thread',
      urlPlaceholder: 'Paste a Threads link',
      urlLabel: 'Threads URL',
      urlHint: 'e.g., https://threads.net/@username/post/xxxxx',
      memoLabel: 'Memo (for search)',
      memoPlaceholder: 'Add a memo about this post. It will be used for searching later.',
      memoHint: '💡 Add keywords, summary, or anything you want to remember',
      saving: 'Saving...',
      saved: 'Saved!',
      alreadySaved: 'This thread is already saved',
      invalidUrl: 'Invalid Threads link',
      invalidOrInaccessible: 'Unable to access the link. The post may have been deleted or is private.',
      deleteConfirm: 'Delete this thread?',
      maxReached: 'Storage limit reached (200 threads)',
    },
    // Tags
    tag: {
      tags: 'Tags',
      addTag: 'Add Tag',
      newTag: 'New Tag',
      tagName: 'Tag Name',
      tagColor: 'Tag Color',
      noTags: 'No tags',
      manageTags: 'Manage Tags',
      deleteTagConfirm: 'Delete this tag?',
    },
    // Settings
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
      account: 'Account',
      deleteAccount: 'Delete Account',
      deleteAccountConfirm: 'Are you sure? All your data will be permanently deleted.',
    },
    // PWA
    pwa: {
      installTitle: 'Install App',
      installDescription: 'Add to home screen for quick access',
      install: 'Install',
      notNow: 'Not now',
      shareTargetSaving: 'Saving...',
      shareTargetSuccess: 'Saved!',
      shareTargetError: 'Only Threads links can be saved',
    },
  },
} as const;

export type Language = keyof typeof translations;

type TranslationStructure = {
  common: {
    appName: string;
    tagline: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    search: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
  };
  auth: {
    login: string;
    logout: string;
    loginWithGoogle: string;
    loginTitle: string;
    loginSubtitle: string;
    welcomeBack: string;
  };
  home: {
    title: string;
    empty: string;
    emptySubtitle: string;
    noResults: string;
    noResultsSubtitle: string;
    addNew: string;
    searchPlaceholder: string;
    sortBy: string;
    sortNewest: string;
    sortOldest: string;
    viewOriginal: string;
  };
  thread: {
    saveTitle: string;
    urlPlaceholder: string;
    urlLabel: string;
    urlHint: string;
    memoLabel: string;
    memoPlaceholder: string;
    memoHint: string;
    saving: string;
    saved: string;
    alreadySaved: string;
    invalidUrl: string;
    invalidOrInaccessible: string;
    deleteConfirm: string;
    maxReached: string;
  };
  tag: {
    tags: string;
    addTag: string;
    newTag: string;
    tagName: string;
    tagColor: string;
    noTags: string;
    manageTags: string;
    deleteTagConfirm: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    account: string;
    deleteAccount: string;
    deleteAccountConfirm: string;
  };
  pwa: {
    installTitle: string;
    installDescription: string;
    install: string;
    notNow: string;
    shareTargetSaving: string;
    shareTargetSuccess: string;
    shareTargetError: string;
  };
};

export type TranslationKeys = TranslationStructure;
