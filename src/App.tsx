import React, { useState, useEffect } from 'react';

interface Story {
  title: string;
  author: string;
  content: string;
  questions: string[];
  chatTopic: string;
}

interface Activity {
  title: string;
  day: string;
  category: string;
  duration: string;
  icon: string;
  desc: string;
  rules: string[];
  benefit: string;
}

interface TaskItem {
  id: number;
  text: string;
  assignees: string[];
  done: boolean;
}

interface MeetingRecord {
  id: number;
  date: string;
  rawDate: string;
  reporter: string;
  issues: string;
  decisions: string;
}

// Initial Data
const initialLoveWords = [
  "Seninle vakit geçirmek günümün en güzel anı.",
  "Fikrin benim için çok değerli, iyi ki paylaştın.",
  "Bu konuda gösterdiğin çabayı görüyor ve takdir ediyorum.",
  "İyi ki bizim ailemizdensin.",
  "Bugün sana nasıl yardımcı olabilirim?",
  "Varlığın bana huzur veriyor.",
  "Gülüşün tüm evin neşesi.",
  "Birlikte olduğumuz her an çok kıymetli."
];

const activitiesData: Activity[] = [
  {
    title: "Duygu Pandomimi (Sessiz Sinema)",
    day: "Pazartesi",
    category: "Oyun",
    duration: "15 Dk",
    icon: "fa-masks-theater",
    desc: "Küçük kağıtlara 'mutlu, üzgün, kızgın, şaşırmış, korkmuş, gururlu, kıskanç' gibi duygular yazın. Sırayla kağıt çekip, konuşmadan sadece mimik ve beden diliyle o duyguyu anlatmaya çalışın.",
    rules: [
      "Her oyuncunun anlatmak için 1 dakikası vardır.",
      "Ses çıkarmak ve dudak okutmak yasaktır.",
      "En çok doğru tahmin eden kişi 'Duygu Dedektifi' unvanını alır."
    ],
    benefit: "Sözel olmayan ipuçlarıyla duyguları tanıma ve ifade etme becerisini geliştirir. Duygularını konuşmakta zorlanan çocuklar için harikadır."
  },
  {
    title: "Günün En'leri Masası",
    day: "Salı",
    category: "Sohbet",
    duration: "10 Dk",
    icon: "fa-star",
    desc: "Akşam yemeğinde veya çay saatinde herkes sırayla gününün 'En komik', 'En zor' ve 'En gurur verici' anını paylaşır.",
    rules: [
      "Konuşan kişinin sözü asla kesilmez.",
      "Yargılamak veya eleştirmek yasaktır, sadece dinlenir.",
      "Gönüllü olmayan zorlanmaz, pas diyebilir."
    ],
    benefit: "Aile üyelerinin birbirlerinin günlük yaşantılarından haberdar olmasını sağlar, empatiyi artırır."
  },
  {
    title: "Birlikte Mutfak Zamanı",
    day: "Çarşamba",
    category: "Etkinlik",
    duration: "45 Dk",
    icon: "fa-utensils",
    desc: "Ailecek kolay bir tarif (örneğin kurabiye veya kek) seçin ve mutfakta iş bölümü yaparak birlikte hazırlayın.",
    rules: [
      "Herkesin bir görevi olmalı (çırpma, dökme, şekil verme).",
      "Mutfak kirlenebilir, temizlik de ortak yapılmalıdır.",
      "Eğlenmek esastır, mükemmel şekilli kurabiyeler şart değil."
    ],
    benefit: "İşbirliği ve takım çalışması becerilerini geliştirir. Birlikte üretmenin hazzını yaşatır."
  },
  {
    title: "Ev İçi Hazine Avı",
    day: "Perşembe",
    category: "Oyun",
    duration: "30 Dk",
    icon: "fa-map",
    desc: "Evin farklı köşelerine küçük ipuçları saklayın. Her ipucu bir sonrakini göstersin ve finalde küçük bir sürpriz olsun.",
    rules: [
      "İpuçları evin tehlikeli yerlerine saklanmamalıdır.",
      "Büyükler küçükler için, küçükler büyükler için ipucu hazırlayabilir.",
      "Süre tutularak heyecan artırılabilir."
    ],
    benefit: "Problem çözme yeteneğini ve analitik düşünmeyi eğlenceli bir yolla destekler."
  },
  {
    title: "Aile Albümü İncelemesi",
    day: "Cuma",
    category: "Sohbet",
    duration: "20 Dk",
    icon: "fa-images",
    desc: "Eski fotoğraf albümlerini veya dijital fotoğrafları açın. Anne ve babanın çocukluk veya gençlik yıllarına ait anıları konuşun.",
    rules: [
      "Herkes bir fotoğraf seçip onunla ilgili bir anı veya düşünce paylaşsın.",
      "Çocuklar ebeveynlerine o dönemle ilgili merak ettiklerini sorabilir."
    ],
    benefit: "Kuşaklar arası bağı güçlendirir, köklenme hissi verir. Ailenin tarihini öğrenmek güven aşılar."
  },
  {
    title: "Ev Yapımı Sinema Gecesi",
    day: "Cumartesi",
    category: "Etkinlik",
    duration: "120 Dk",
    icon: "fa-film",
    desc: "Ailecek izlenecek bir film seçin. Ortamı sinema salonuna çevirin (ışıkları kapatın, bilet hazırlayın, mısır patlatın).",
    rules: [
      "Film seçimi ortak kararla (oylama) yapılmalıdır.",
      "Film izlerken telefonla oynamak yasaktır.",
      "Film bittikten sonra 5 dakika film üzerine sohbet edilir."
    ],
    benefit: "Ortak kültürel tüketim sağlar. Tartışmalar eleştirel düşünmeyi kolaylaştırır."
  },
  {
    title: "Sessiz Okuma Saati",
    day: "Pazar",
    category: "Etkinlik",
    duration: "30 Dk",
    icon: "fa-book-open",
    desc: "Televizyon ve telefonları kapatın. Herkes kendi kitabını veya dergisini alsın. Sessizlik içinde çay veya süt eşliğinde okuma saati yapın.",
    rules: [
      "Süre bitene kadar teknolojik aletlere bakılmaz.",
      "Süre bitiminde herkes okuduğu bölümden en ilginç bulduğu bir cümleyi paylaşabilir."
    ],
    benefit: "Okuma alışkanlığını destekler. Birlikte sessizliği paylaşabilmek iç huzuru artırır."
  }
];

const bookStories: Story[] = [
  {
    title: "Önsöz",
    author: "Bilsem Öğrencilerinin Kaleminden",
    content: `
      <div class="mb-6 flex justify-center">
        <div class="w-16 h-1 bg-purple-200 rounded"></div>
      </div>
      <p class="mb-4">Kıymetli aileler,</p>
      <p class="mb-4"><strong>"Aile Dediğin"</strong> kitabı, BİLSEM öğrencilerimizin tertemiz yüreklerinden süzülen, aile olmanın sıcaklığını, zorluklarını ve güzelliklerini anlatan eşsiz hikayelerden oluşuyor. Bu kitap sadece okunmak için değil; üzerinde konuşulmak, birbirimizi daha iyi anlamak ve bağlarımızı güçlendirmek için hazırlandı.</p>
      <p class="mb-4">Modern çağın hızına kapılıp birbirimize vakit ayıramadığımız şu günlerde, bu kitaptaki her bir hikaye, kendi ailenizden bir parça bulabileceğiniz birer ayna niteliğindedir. Bir hikayede kendi geçmişinize dalacak, diğerinde çocuklarınızın dünyasına pencere açacaksınız.</p>
      <p class="mb-4">Sizlerden ricam; lütfen bu portalı bir rehber olarak kullanın. Hikayeleri ailecek, göz teması kurarak, televizyonu ve telefonları bir kenara bırakarak <strong>kitabınızdan</strong> okuyun. Ardından burada hazırladığımız "Aile Sohbeti" başlıkları ve soruları üzerine konuşun.</p>
      <p class="mb-2">İletişiminizin, muhabbetinizin ve sevginizin daim olması dileğiyle... Keyifli okumalar ve sıcacık sohbetler dileriz.</p>
    `,
    questions: [],
    chatTopic: ""
  },
  {
    title: "Mirasın Gerçek Sahibi",
    author: "Ertuğrul ERDEM",
    content: `<div class="bg-orange-50/80 p-8 rounded-2xl border border-orange-200 text-center mb-6 shadow-sm"><i class="fas fa-book-open text-5xl text-orange-400 mb-4 block"></i><h3 class="text-orange-900 font-bold text-xl mb-2 font-serif">Okuma Zamanı</h3><p class="text-orange-800 text-lg">Lütfen "Mirasın Gerçek Sahibi" adlı hikayeyi <strong>Aile Dediğin</strong> kitabınızdan ailecek okuyun.</p></div>`,
    questions: [
      "Sizce teknoloji ve ekranlar, aile mirası ve anıları bize unutturuyor olabilir mi? Neden?",
      "Evimizde dedelerimizden/ninelerimizden kalan, maddi değeri olmasa da manevi değeri çok yüksek olan hangi eşyalar var?",
      "Hikayedeki çoban kaftanı neden satmadı? Sizin için paha biçilemez olan manevi değerler nelerdir?"
    ],
    chatTopic: "Aile yadigarları, geçmişten günümüze taşıdığımız manevi değerler ve hatıraların hayatımızdaki yeri."
  },
  {
    title: "Keşke Her Gün Pazar Olsa",
    author: "Büşra ERYİĞİT",
    content: `<div class="bg-orange-50/80 p-8 rounded-2xl border border-orange-200 text-center mb-6 shadow-sm"><i class="fas fa-book-open text-5xl text-orange-400 mb-4 block"></i><h3 class="text-orange-900 font-bold text-xl mb-2 font-serif">Okuma Zamanı</h3><p class="text-orange-800 text-lg">Lütfen "Keşke Her Gün Pazar Olsa" adlı hikayeyi <strong>Aile Dediğin</strong> kitabınızdan ailecek okuyun.</p></div>`,
    questions: [
      "Hafta içi koşturmacasında birbirinize daha fazla vakit ayırmak için günlük rutinlerinizde ne gibi küçük değişiklikler yapabilirsiniz?",
      "Sizin evinizde de 'Keşke her gün o gün olsa' dediğiniz özel bir gün, saat veya an var mı?",
      "Ailecek oynadığınız, izlediğiniz veya yaptığınız favori pazar günü etkinliğiniz nedir?"
    ],
    chatTopic: "Hızla akan hayatın içinde aileye bilinçli olarak 'kaliteli zaman' ayırmanın yolları."
  },
  {
    title: "Duvardaki Saat",
    author: "Eslem Beyza EKMEN",
    content: `<div class="bg-orange-50/80 p-8 rounded-2xl border border-orange-200 text-center mb-6 shadow-sm"><i class="fas fa-book-open text-5xl text-orange-400 mb-4 block"></i><h3 class="text-orange-900 font-bold text-xl mb-2 font-serif">Okuma Zamanı</h3><p class="text-orange-800 text-lg">Lütfen "Duvardaki Saat" adlı hikayeyi <strong>Aile Dediğin</strong> kitabınızdan ailecek okuyun.</p></div>`,
    questions: [
      "Evinizde düzenli olarak yaptığınız, zamanın nasıl geçtiğini unuttuğunuz bir etkinlik var mı? Yoksa ne başlatabiliriz?",
      "Hikayede saat neden durmuş olabilir? Aile bağlarının zayıflaması bir evin ruhunu nasıl etkiler?",
      "Telefon ve televizyon kullanımını evde dengede tutmak için ailecek hangi yeni kuralları koyabiliriz?"
    ],
    chatTopic: "Teknolojinin aile içi iletişimi bölmesine izin vermemek ve 'ekransız zaman' dilimleri oluşturmak."
  },
  {
    title: "Zaman Yolculuğu ve Aile Hasreti",
    author: "Sahra KARAKAYA",
    content: `<div class="bg-orange-50/80 p-8 rounded-2xl border border-orange-200 text-center mb-6 shadow-sm"><i class="fas fa-book-open text-5xl text-orange-400 mb-4 block"></i><h3 class="text-orange-900 font-bold text-xl mb-2 font-serif">Okuma Zamanı</h3><p class="text-orange-800 text-lg">Lütfen "Zaman Yolculuğu ve Aile Hasreti" adlı hikayeyi <strong>Aile Dediğin</strong> kitabınızdan ailecek okuyun.</p></div>`,
    questions: [
      "Bir zaman makineniz olsa, ailenizle geçirdiğiniz hangi mutlu anıya geri dönmek isterdiniz? Neden o anı?",
      "Birbirimizin değerini yan yanayken ve anı yaşarken bilmek için bugün birbirimize ne söylemek istersiniz?",
      "Gelecekte 'keşke o günlere dönsek' diyeceğiniz güzel anıları bugünden oluşturmak için bu hafta sonu ne yapalım?"
    ],
    chatTopic: "Anı yaşamak, sahip olduklarımızın şükrünü bilmek ve aile üyelerine duyulan sevginin sık sık ifade edilmesi."
  }
];

// Realistic Book Cover Component with requested "Bilsem öğrencilerinin Kaleminden" and NO "Hümeyra Ekmen"
function BookCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-64 h-96 rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-900/10 flex flex-col justify-between p-6 select-none transition-all duration-300 transform hover:scale-[1.03] group ${className}`}
      style={{
        background: 'linear-gradient(135deg, #7c2d12 0%, #991b1b 50%, #450a0a 100%)',
        boxShadow: '0 20px 30px -10px rgba(69, 10, 10, 0.4), 0 0 0 1px rgba(254, 243, 199, 0.15)'
      }}
    >
      {/* Book Spine Shading Effect */}
      <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 left-6 w-px bg-amber-400/25 pointer-events-none z-20" />

      {/* Decorative Golden Ribbon */}
      <div className="absolute top-0 right-6 w-7 h-14 bg-gradient-to-b from-amber-300 to-amber-500 shadow-md z-20 transform -translate-y-1">
        <div className="absolute bottom-0 left-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[10px] border-b-[#7c2d12]"></div>
      </div>

      {/* Foil Embossed Outer Border */}
      <div className="absolute inset-3 border border-amber-300/30 rounded-xl pointer-events-none z-10" />
      <div className="absolute inset-4 border border-amber-300/15 rounded-lg pointer-events-none z-10" />

      {/* Top Banner: Explicit requirement */}
      <div className="relative z-10 text-center pt-2">
        <div className="inline-block px-3 py-1 bg-amber-100/15 backdrop-blur-xs border border-amber-300/40 rounded-full shadow-sm">
          <span className="text-[11px] font-bold tracking-wider text-amber-200 uppercase">
            Bilsem öğrencilerinin Kaleminden
          </span>
        </div>
      </div>

      {/* Center Motif & Title */}
      <div className="relative z-10 text-center my-auto flex flex-col items-center">
        {/* Emblem */}
        <div className="w-20 h-20 rounded-full border-2 border-amber-300/50 flex items-center justify-center mb-3 bg-amber-950/40 shadow-inner group-hover:border-amber-200 transition-colors">
          <i className="fas fa-heart text-amber-200 text-3xl drop-shadow"></i>
        </div>

        <h2 className="font-serif text-3xl font-extrabold tracking-wide text-amber-100 drop-shadow-md leading-tight">
          AİLE DEDİĞİN
        </h2>
        
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent my-2 rounded-full" />
        
        <p className="text-xs font-medium text-amber-200/90 tracking-wide max-w-[180px] leading-relaxed">
          Bilsem Öğrencilerinin Kaleminden
        </p>
      </div>

      {/* Bottom Subtitle / Category */}
      <div className="relative z-10 text-center border-t border-amber-300/20 pt-3">
        <span className="text-[10px] font-semibold text-amber-200/70 tracking-widest uppercase block">
          Aile Sohbetleri & Değerler Rehberi
        </span>
      </div>

      {/* Subtle textured overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
}

export default function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<'home' | 'daily' | 'book' | 'chat' | 'tasks' | 'meeting'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  // Time & Clock
  const [timeString, setTimeString] = useState('');

  // Family Members
  const [familyMembers, setFamilyMembers] = useState<string[]>(() => {
    const saved = localStorage.getItem('ab_family_members');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMemberName, setNewMemberName] = useState('');

  // Love Word
  const [loveWord, setLoveWord] = useState(initialLoveWords[0]);
  const [loveWordFade, setLoveWordFade] = useState(false);

  // Daily Activity State
  const [currentActivityIndex, setCurrentActivityIndex] = useState(() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; // 0 Pazar -> 6, 1 Pazartesi -> 0
  });
  const [activityCompleted, setActivityCompleted] = useState(false);

  // Book & Stories
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Meeting System
  const [meetingRecords, setMeetingRecords] = useState<MeetingRecord[]>(() => {
    const saved = localStorage.getItem('ab_meeting_records');
    return saved ? JSON.parse(saved) : [];
  });
  const [meetingDate, setMeetingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [meetingReporter, setMeetingReporter] = useState('');
  const [meetingIssues, setMeetingIssues] = useState('');
  const [meetingDecisions, setMeetingDecisions] = useState('');

  // Tasks System
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('ab_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Akşam yemeği sonrası masayı toplamak", assignees: [], done: false },
      { id: 2, text: "Pazar kahvaltısını hazırlamak", assignees: [], done: false }
    ];
  });
  const [newTaskInput, setNewTaskInput] = useState('');
  const [assignModalTaskId, setAssignModalTaskId] = useState<number | null>(null);

  // Ben Dili Generator
  const [benBehavior, setBenBehavior] = useState('');
  const [benFeeling, setBenFeeling] = useState('');
  const [benRequest, setBenRequest] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Custom Modal (Safe replacement for alert/prompt)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isPrompt?: boolean;
    promptValue?: string;
    onConfirm?: (value?: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  // LocalStorage Persist
  useEffect(() => {
    localStorage.setItem('ab_family_members', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('ab_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ab_meeting_records', JSON.stringify(meetingRecords));
  }, [meetingRecords]);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timePart = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      setTimeString(`${datePart} - ${timePart}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set default reporter when members change
  useEffect(() => {
    if (familyMembers.length > 0 && !meetingReporter) {
      setMeetingReporter(familyMembers[0]);
    }
  }, [familyMembers, meetingReporter]);

  // Trigger Modal
  const showAlert = (title: string, message: string) => {
    setModalConfig({
      isOpen: true,
      title,
      message
    });
  };

  // Member Management
  const handleAddMember = () => {
    const trimmed = newMemberName.trim();
    if (trimmed && !familyMembers.includes(trimmed)) {
      const updated = [...familyMembers, trimmed];
      setFamilyMembers(updated);
      setNewMemberName('');
      
      // Auto-assign sample tasks if first time
      if (tasks[0] && tasks[0].assignees.length === 0) {
        setTasks(prev => [
          { ...prev[0], assignees: [trimmed] },
          ...prev.slice(1)
        ]);
      }
    }
  };

  const handleRemoveMember = (name: string) => {
    setFamilyMembers(prev => prev.filter(m => m !== name));
  };

  const handleStartPortal = () => {
    if (familyMembers.length === 0) {
      showAlert('Üye Gerekli', 'Lütfen portala devam edebilmek için en az bir aile üyesi ekleyin.');
      return;
    }
    setShowWelcomeScreen(false);
  };

  // Love Word Generator
  const handleGenerateLoveWord = () => {
    setLoveWordFade(true);
    setTimeout(() => {
      let nextWord = loveWord;
      while (nextWord === loveWord && initialLoveWords.length > 1) {
        nextWord = initialLoveWords[Math.floor(Math.random() * initialLoveWords.length)];
      }
      setLoveWord(nextWord);
      setLoveWordFade(false);
    }, 200);
  };

  // Activity Handlers
  const handleRandomActivity = () => {
    let nextIdx = currentActivityIndex;
    while (nextIdx === currentActivityIndex && activitiesData.length > 1) {
      nextIdx = Math.floor(Math.random() * activitiesData.length);
    }
    setCurrentActivityIndex(nextIdx);
    setActivityCompleted(false);
  };

  // Meeting Handlers
  const handleSaveMeeting = () => {
    if (!meetingDate || !meetingReporter || !meetingIssues.trim() || !meetingDecisions.trim()) {
      showAlert('Eksik Alan', 'Lütfen tüm toplantı tutanak alanlarını doldurun.');
      return;
    }

    const formattedDate = new Date(meetingDate).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newRecord: MeetingRecord = {
      id: Date.now(),
      date: formattedDate,
      rawDate: meetingDate,
      reporter: meetingReporter,
      issues: meetingIssues.trim(),
      decisions: meetingDecisions.trim()
    };

    setMeetingRecords(prev => [newRecord, ...prev]);
    setMeetingIssues('');
    setMeetingDecisions('');
    showAlert('Kayıt Başarılı', 'Haftalık toplantı tutanağı başarıyla kaydedildi.');
  };

  const handleDeleteMeeting = (id: number) => {
    setMeetingRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleExportMeetingToWord = (record: MeetingRecord) => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Aile Toplantı Tutanağı</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="text-align: center; color: #b45309;">Haftalık Aile Toplantısı Tutanağı</h1>
          <p><strong>Tarih:</strong> ${record.date}</p>
          <p><strong>Toplantı Raportörü:</strong> ${record.reporter}</p>
          <hr style="border: 1px solid #fed7aa;" />
          <h2 style="color: #92400e;">Gündem: Aile İçi Sorunlar ve İhtiyaçlar</h2>
          <p style="background: #fef3c7; padding: 12px; border-radius: 8px;">${record.issues.replace(/\n/g, '<br>')}</p>
          <h2 style="color: #92400e;">Alınan Kararlar ve Çözümler</h2>
          <p style="background: #ecfdf5; padding: 12px; border-radius: 8px;">${record.decisions.replace(/\n/g, '<br>')}</p>
          <br>
          <p style="text-align: right; color: #78716c;"><em>Aile Bağları: "Aile Dediğin" Platformu tarafından oluşturulmuştur.</em></p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aile_Toplanti_Tutanagi_${record.date.replace(/ /g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Tasks Handlers
  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask: TaskItem = {
      id: Date.now(),
      text: newTaskInput.trim(),
      assignees: [],
      done: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskInput('');
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleAssignee = (taskId: number, memberName: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const exists = t.assignees.includes(memberName);
        const updatedAssignees = exists
          ? t.assignees.filter(a => a !== memberName)
          : [...t.assignees, memberName];
        return { ...t, assignees: updatedAssignees };
      })
    );
  };

  // Ben Dili Generator
  const handleGenerateBenMessage = () => {
    if (!benBehavior.trim() || !benFeeling || !benRequest.trim()) {
      showAlert('Eksik Bilgi', 'Lütfen davranış, duygu ve istek alanlarını doldurun.');
      return;
    }
    const cleanBehavior = benBehavior.trim();
    const formattedBehavior = cleanBehavior.charAt(0).toLowerCase() + cleanBehavior.slice(1);
    const result = `Sen ${formattedBehavior}, ben ${benFeeling}. ${benRequest.trim()}`;
    setGeneratedMessage(result);
  };

  const handleCopyMessage = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const currentAct = activitiesData[currentActivityIndex];
  const currentStory = bookStories[currentStoryIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf6] text-slate-700">
      
      {/* ==================== WELCOME OVERLAY MODAL ==================== */}
      {showWelcomeScreen && (
        <div className="fixed inset-0 bg-[#fdfaf6]/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 my-auto">
            {/* Left Cover & Quote */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col items-center justify-center text-center border-r border-slate-100 relative bg-gradient-to-br from-amber-50/80 via-rose-50/50 to-orange-50/80">
              <div className="absolute top-4 left-4 text-rose-300 text-5xl opacity-40">
                <i className="fas fa-quote-left"></i>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-6 relative z-10 leading-snug">
                "Aile, insanın ruhunu ısıtan en eski ocaktır."
              </h2>

              {/* Kitap Kapağı Görseli: "Bilsem öğrencilerinin Kaleminden" ifadesi geçer, Hümeyra Ekmen yazısı yazmaz */}
              <div className="mb-4">
                <BookCover />
              </div>
              
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                BİLSEM Aile Eğitim & Etkinlik Projesi
              </p>
            </div>

            {/* Right Setup Screen */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
              {timeString && (
                <div className="text-teal-700 font-medium text-sm md:text-base mb-6 border-b border-slate-100 pb-3 text-center flex items-center justify-center">
                  <i className="far fa-clock mr-2 text-teal-600"></i>
                  {timeString}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 font-serif">
                Hoş Geldiniz
              </h1>
              <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
                Portala giriş yapmak ve aile içi etkinlikleri başlatmak için lütfen aile üyelerinin isimlerini ekleyin.
              </p>

              {/* Add Member Form */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddMember();
                    }}
                    placeholder="Örn: Anne, Baba, Kerem, Zeynep..."
                    className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none bg-slate-50 focus:bg-white text-slate-800 text-base transition-all"
                  />
                  <button
                    onClick={handleAddMember}
                    className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center"
                    title="Üye Ekle"
                  >
                    <i className="fas fa-plus text-lg"></i>
                  </button>
                </div>

                {/* Member List Badges */}
                <div className="min-h-[60px] max-h-40 overflow-y-auto space-y-2 p-1">
                  {familyMembers.length === 0 ? (
                    <div className="text-sm text-slate-400 italic text-center py-3 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                      Henüz aile üyesi eklenmedi. Yukarıdan yazıp ekleyin.
                    </div>
                  ) : (
                    familyMembers.map((name) => (
                      <div
                        key={name}
                        className="bg-indigo-50 text-indigo-800 px-4 py-2.5 rounded-xl flex justify-between items-center font-medium border border-indigo-100 shadow-xs"
                      >
                        <span className="flex items-center">
                          <i className="fas fa-user-circle text-indigo-400 mr-2 text-lg"></i>
                          {name}
                        </span>
                        <button
                          onClick={() => handleRemoveMember(name)}
                          className="text-indigo-400 hover:text-red-500 transition-colors p-1"
                          title="Sil"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Start Portal Button */}
              <button
                onClick={handleStartPortal}
                disabled={familyMembers.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  familyMembers.length > 0
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 cursor-pointer transform hover:scale-[1.01]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Portala Giriş Yap</span>
                <i className="fas fa-arrow-right"></i>
              </button>

              {familyMembers.length > 0 && (
                <p className="text-center text-xs text-slate-400 mt-3">
                  {familyMembers.length} aile üyesi tanımlandı. İstediğiniz an değiştirebilirsiniz.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== APP HEADER ==================== */}
      <header className="bg-white/90 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all shadow-xs">
                <i className="fas fa-home text-xl"></i>
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tight text-slate-800 serif block leading-tight">
                  Aile Bağları
                </span>
                <span className="text-[11px] text-amber-700 font-medium tracking-wide uppercase">
                  "Aile Dediğin" Platformu
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'home'
                    ? 'text-indigo-600 bg-indigo-50 font-bold'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'daily'
                    ? 'text-orange-600 bg-orange-50 font-bold'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                Oyun & Etkinlik
              </button>
              <button
                onClick={() => setActiveTab('book')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'book'
                    ? 'text-purple-600 bg-purple-50 font-bold'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
              >
                "Aile Dediğin" Rehberi
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'text-blue-600 bg-blue-50 font-bold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                İletişim Köşesi
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'tasks'
                    ? 'text-green-600 bg-green-50 font-bold'
                    : 'text-slate-600 hover:text-green-600 hover:bg-slate-50'
                }`}
              >
                Görevler
              </button>
              <button
                onClick={() => setActiveTab('meeting')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${
                  activeTab === 'meeting'
                    ? 'text-amber-800 bg-amber-100 border border-amber-300 shadow-xs'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100/70 border border-amber-200'
                }`}
              >
                <i className="fas fa-mug-hot mr-1.5 text-amber-600"></i>
                Aile Toplantısı
              </button>

              {/* Members Quick Button */}
              <button
                onClick={() => setShowWelcomeScreen(true)}
                className="ml-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 transition-colors flex items-center gap-1.5"
                title="Aile Üyelerini Düzenle"
              >
                <i className="fas fa-users text-teal-600"></i>
                <span>{familyMembers.length > 0 ? `${familyMembers.length} Üye` : 'Üye Ekle'}</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setShowWelcomeScreen(true)}
                className="p-2 text-slate-600 hover:text-teal-600 text-sm flex items-center gap-1"
                title="Aile Üyeleri"
              >
                <i className="fas fa-users text-teal-600"></i>
                <span className="font-bold text-xs">{familyMembers.length}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 focus:outline-none"
                aria-label="Menü"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl px-4 py-3 space-y-1">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 rounded-xl font-medium ${
                activeTab === 'home' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <i className="fas fa-home mr-2 text-indigo-500"></i> Ana Sayfa
            </button>
            <button
              onClick={() => { setActiveTab('daily'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 rounded-xl font-medium ${
                activeTab === 'daily' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <i className="fas fa-puzzle-piece mr-2 text-orange-500"></i> Oyun & Etkinlik
            </button>
            <button
              onClick={() => { setActiveTab('book'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 rounded-xl font-medium ${
                activeTab === 'book' ? 'bg-purple-50 text-purple-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <i className="fas fa-book-reader mr-2 text-purple-500"></i> "Aile Dediğin" Rehberi
            </button>
            <button
              onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 rounded-xl font-medium ${
                activeTab === 'chat' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <i className="fas fa-hands-holding-heart mr-2 text-blue-500"></i> İletişim Köşesi
            </button>
            <button
              onClick={() => { setActiveTab('tasks'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 rounded-xl font-medium ${
                activeTab === 'tasks' ? 'bg-green-50 text-green-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <i className="fas fa-clipboard-list mr-2 text-green-500"></i> Görevler
            </button>
            <button
              onClick={() => { setActiveTab('meeting'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2.5 rounded-xl font-bold bg-amber-50 text-amber-800 border border-amber-200"
            >
              <i className="fas fa-mug-hot mr-2 text-amber-600"></i> Haftalık Aile Toplantısı
            </button>
          </div>
        )}
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================== TAB: HOME ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-10 animate-fade-in">
            {/* Hero Card */}
            <div className="bg-white rounded-3xl p-8 md:p-14 shadow-sm border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full text-amber-800 text-xs font-bold uppercase tracking-wider mb-6">
                <i className="fas fa-feather-pointed text-amber-600"></i>
                Bilsem Öğrencilerinin Kaleminden
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 serif text-slate-800 relative z-10 leading-tight">
                Ailemiz,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-500 to-indigo-600">
                  En Büyük Hazinemiz
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed relative z-10">
                Modern zamanın koşturmacasına inat, birbirimize daha sıkı sarılmak, iletişimimizi güçlendirmek ve dijital kopukluktan uzaklaşarak "biz olma" duygusunu yaşatmak için tasarlandı.
              </p>

              {/* Günün Sevgi Sözcüğü */}
              <div className="mt-10 inline-block bg-gradient-to-r from-indigo-50/70 via-purple-50/60 to-pink-50/70 rounded-2xl p-6 md:p-8 border border-indigo-100/70 relative z-10 w-full max-w-2xl text-left shadow-sm">
                <div className="flex items-start">
                  <i className="fas fa-quote-left text-3xl text-indigo-400 mr-4 mt-1 shrink-0"></i>
                  <div className="flex-grow">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-indigo-700 mb-2 flex items-center gap-1.5">
                      <i className="fas fa-heart text-rose-500"></i>
                      Günün Sevgi Sözcüğü
                    </h3>
                    <p
                      className={`text-xl md:text-2xl font-serif font-medium text-slate-800 italic transition-opacity duration-300 ${
                        loveWordFade ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      "{loveWord}"
                    </p>
                    <button
                      onClick={handleGenerateLoveWord}
                      className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center transition-colors hover:underline cursor-pointer"
                    >
                      <i className="fas fa-sync-alt mr-1.5"></i> Başka bir sevgi sözcüğü göster
                    </button>
                  </div>
                </div>
              </div>

              {/* Family Members Preview */}
              {familyMembers.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 relative z-10">
                  <span className="text-xs text-slate-500 font-semibold uppercase mr-2">
                    Aktif Aile Üyeleri:
                  </span>
                  {familyMembers.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200 flex items-center gap-1.5"
                    >
                      <i className="fas fa-user text-slate-400 text-[10px]"></i>
                      {m}
                    </span>
                  ))}
                  <button
                    onClick={() => setShowWelcomeScreen(true)}
                    className="text-xs text-teal-600 hover:text-teal-800 font-semibold ml-2 underline"
                  >
                    Üye Yönetimi
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard 4 Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Etkinlikler */}
              <div
                onClick={() => setActiveTab('daily')}
                className="bg-white rounded-2xl p-7 card-shadow border border-slate-100 cursor-pointer flex flex-col h-full hover:border-orange-300 group"
              >
                <div className="w-14 h-14 bg-orange-50 group-hover:bg-orange-500 text-orange-500 group-hover:text-white rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all shadow-xs">
                  <i className="fas fa-puzzle-piece"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Etkinlikler & Oyunlar</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  Her güne özel, ailenizle eğlenceli ve kaliteli zaman geçirmenizi sağlayacak 7 günlük aktivite planı.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-orange-600 font-bold text-xs">
                  <span>Aktiviteleri Keşfet</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Card 2: Aile Toplantısı */}
              <div
                onClick={() => setActiveTab('meeting')}
                className="bg-white rounded-2xl p-7 card-shadow border border-slate-100 cursor-pointer flex flex-col h-full hover:border-amber-300 group"
              >
                <div className="w-14 h-14 bg-amber-50 group-hover:bg-amber-500 text-amber-600 group-hover:text-white rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all shadow-xs">
                  <i className="fas fa-mug-hot"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Aile Toplantısı</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  Çay ve kurabiye eşliğinde haftalık değerlendirme yapın, sorunları konuşun ve Word tutanağı indirin.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-amber-700 font-bold text-xs">
                  <span>Toplantıyı Başlat</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Card 3: Sohbet Rehberi */}
              <div
                onClick={() => setActiveTab('book')}
                className="bg-white rounded-2xl p-7 card-shadow border border-slate-100 cursor-pointer flex flex-col h-full hover:border-purple-300 group"
              >
                <div className="w-14 h-14 bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all shadow-xs">
                  <i className="fas fa-book-reader"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Sohbet Rehberi</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  "Aile Dediğin" kitabındaki öğrenci öykülerini okuyup hazırlanan derinlikli sorularla sohbeti başlatın.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-purple-600 font-bold text-xs">
                  <span>Rehberi Aç</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>

              {/* Card 4: İletişim Köşesi */}
              <div
                onClick={() => setActiveTab('chat')}
                className="bg-white rounded-2xl p-7 card-shadow border border-slate-100 cursor-pointer flex flex-col h-full hover:border-blue-300 group"
              >
                <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all shadow-xs">
                  <i className="fas fa-comments"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">İletişim Köşesi</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  Anlaşmazlıkları suçlayıcı "Sen Dili" yerine, yapıcı "Ben Dili" ile ifade etme sihirbazı.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-blue-600 font-bold text-xs">
                  <span>Cümle Oluşturucu</span>
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: DAILY ACTIVITIES ==================== */}
        {activeTab === 'daily' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 flex items-center mb-2 font-serif">
                  <i className="fas fa-puzzle-piece text-orange-500 mr-3"></i> Etkinlikler ve Oyunlar
                </h2>
                <p className="text-slate-600 text-lg">
                  Birlikte gülmek, öğrenmek ve güçlü bağlar kurmak için haftalık aile planı.
                </p>
              </div>

              <button
                onClick={handleRandomActivity}
                className="self-start md:self-auto px-5 py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border border-orange-200 shadow-xs cursor-pointer active:scale-95"
              >
                <i className="fas fa-dice text-lg text-orange-600"></i>
                Rastgele Etkinlik Seç
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Activity View */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-orange-50/70 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                    <span className="font-bold text-orange-900 flex items-center gap-2">
                      <i className="far fa-calendar-check text-orange-600"></i>
                      {currentAct.day} Günü Etkinliği
                    </span>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-white text-orange-700 rounded-full text-xs font-bold uppercase tracking-wide shadow-xs border border-orange-200">
                        {currentAct.category}
                      </span>
                      <span className="px-3 py-1 bg-white text-slate-700 rounded-full text-xs font-semibold shadow-xs border border-slate-200">
                        <i className="far fa-clock mr-1 text-slate-400"></i>
                        {currentAct.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mr-5 shrink-0 shadow-inner">
                        <i className={`fas ${currentAct.icon}`}></i>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif">
                          {currentAct.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-base">
                          {currentAct.desc}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-100 mb-6">
                      <h4 className="font-bold text-slate-800 flex items-center mb-3">
                        <i className="fas fa-lightbulb text-amber-500 mr-2 text-lg"></i>
                        Nasıl Oynanır & Kurallar?
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed text-sm md:text-base">
                        {currentAct.rules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-start text-sm text-indigo-900 bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100">
                      <i className="fas fa-heartbeat text-xl mr-3 text-indigo-600 mt-0.5"></i>
                      <div>
                        <strong className="block font-bold text-indigo-900 mb-1">Neden Faydalı?</strong>
                        <span className="text-indigo-800/90 leading-relaxed">{currentAct.benefit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={handleRandomActivity}
                      className="text-slate-600 hover:text-orange-600 font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fas fa-dice text-base"></i> Başka Bir Oyun
                    </button>
                    
                    <button
                      onClick={() => setActivityCompleted(true)}
                      disabled={activityCompleted}
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                        activityCompleted
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md shadow-orange-500/20 cursor-pointer'
                      }`}
                    >
                      <i className={`fas ${activityCompleted ? 'fa-check' : 'fa-check-circle'}`}></i>
                      <span>{activityCompleted ? 'Tamamlandı!' : 'Tamamladık!'}</span>
                    </button>
                  </div>
                </div>

                {/* Celebration Box */}
                {activityCompleted && (
                  <div className="mt-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 text-green-900 p-6 rounded-2xl border border-green-200 text-center animate-fade-in shadow-sm">
                    <div className="text-4xl mb-2">🎉 👨‍👩‍👧‍👦 🌟</div>
                    <h4 className="text-xl font-bold mb-1 font-serif">Tebrikler, Harika İş Çıkardınız!</h4>
                    <p className="text-green-800 text-sm max-w-lg mx-auto">
                      Birlikte geçirdiğiniz bu değerli anlar, ailenizin temelini daha da sağlamlaştırıyor ve unutulmaz anılar inşa ediyor.
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar: Weekly Schedule */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center">
                      <i className="far fa-calendar-alt text-slate-400 mr-2"></i>
                      Haftalık Etkinlik Planı
                    </h3>
                  </div>

                  <div className="p-3 flex-grow overflow-y-auto space-y-1.5 custom-scrollbar">
                    {activitiesData.map((act, index) => {
                      const isSelected = index === currentActivityIndex;
                      return (
                        <div
                          key={act.day}
                          onClick={() => {
                            setCurrentActivityIndex(index);
                            setActivityCompleted(false);
                          }}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center border ${
                            isSelected
                              ? 'bg-orange-50/80 border-orange-200 shadow-xs'
                              : 'hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center mr-3 shrink-0 flex-col font-bold text-xs ${
                              isSelected
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <span>{act.day.substring(0, 3)}</span>
                          </div>
                          <div className="overflow-hidden flex-grow">
                            <h4
                              className={`font-semibold text-sm truncate ${
                                isSelected ? 'text-orange-950 font-bold' : 'text-slate-700'
                              }`}
                            >
                              {act.title}
                            </h4>
                            <span className="text-xs text-slate-400">
                              {act.category} • {act.duration}
                            </span>
                          </div>
                          {isSelected && (
                            <i className="fas fa-chevron-right text-orange-400 text-xs ml-2"></i>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: BOOK REHBERI ==================== */}
        {activeTab === 'book' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 flex items-center mb-2 font-serif">
                  <i className="fas fa-book-reader text-purple-500 mr-3"></i> "Aile Dediğin" Rehberi
                </h2>
                <p className="text-slate-600 text-lg">
                  Hikayelerinizi kitabınızdan okuyun, ardından buradaki sorularla aile sohbetinizi başlatın.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 text-xs font-bold">
                <i className="fas fa-pencil-alt text-purple-600"></i>
                Bilsem Öğrencilerinin Kaleminden
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* TOC Sidebar */}
              <div className="w-full lg:w-1/3 xl:w-1/4">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-28">
                  <div className="bg-purple-50/80 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-purple-900 flex items-center">
                      <i className="fas fa-bookmark text-purple-500 mr-2 text-sm"></i>
                      İçindekiler
                    </h3>
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      {bookStories.length} Bölüm
                    </span>
                  </div>

                  <div className="p-2 space-y-1">
                    {bookStories.map((story, index) => {
                      const isSelected = index === currentStoryIndex;
                      return (
                        <button
                          key={story.title}
                          onClick={() => setCurrentStoryIndex(index)}
                          className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center justify-between text-sm ${
                            isSelected
                              ? 'bg-purple-100/70 text-purple-900 font-bold border border-purple-200 shadow-xs'
                              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center overflow-hidden mr-2">
                            <i
                              className={`fas fa-bookmark mr-3 text-xs ${
                                isSelected ? 'text-purple-600' : 'text-slate-300'
                              }`}
                            ></i>
                            <span className="truncate">{story.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal shrink-0">
                            {index === 0 ? 'Giriş' : `${index}. Öykü`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reading & Discussion View */}
              <div className="w-full lg:w-2/3 xl:w-3/4">
                <div className="book-page p-8 md:p-14 min-h-[600px] border border-slate-200 shadow-sm rounded-3xl relative">
                  {/* Story Header */}
                  <div className="text-center mb-8 pb-6 border-b border-slate-200/70">
                    <span className="inline-block text-xs uppercase tracking-widest text-purple-600 font-bold mb-2">
                      Aile Dediğin • {currentStoryIndex === 0 ? 'Önsöz' : `Bölüm ${currentStoryIndex}`}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-3">
                      {currentStory.title}
                    </h2>
                    
                    {/* Author Attribution: "Bilsem öğrencilerinin Kaleminden", no Hümeyra Ekmen */}
                    <div className="text-slate-500 italic text-sm flex items-center justify-center">
                      <span className="w-8 h-px bg-slate-300 mr-3" />
                      <span>{currentStory.author}</span>
                      <span className="w-8 h-px bg-slate-300 ml-3" />
                    </div>
                  </div>

                  {/* Story Text / Reading Notice */}
                  <div
                    className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-serif text-[1.1rem]"
                    dangerouslySetInnerHTML={{ __html: currentStory.content }}
                  />

                  {/* Chat Topic Box */}
                  {currentStory.chatTopic && (
                    <div className="mt-8 bg-teal-50/80 p-6 md:p-7 rounded-2xl border border-teal-200 shadow-xs animate-fade-in">
                      <h4 className="font-bold text-teal-900 flex items-center mb-2 text-base md:text-lg">
                        <i className="fas fa-comments text-teal-600 mr-2 text-xl"></i>
                        Aile Sohbeti Gündemi
                      </h4>
                      <p className="text-teal-800 leading-relaxed text-base">
                        {currentStory.chatTopic}
                      </p>
                    </div>
                  )}

                  {/* Reflection Questions */}
                  {currentStory.questions && currentStory.questions.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-200 animate-fade-in">
                      <div className="bg-purple-50/70 rounded-2xl p-6 md:p-8 border border-purple-100">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-xs text-xl shrink-0">
                            <i className="fas fa-question"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-purple-900 font-serif">
                              Üzerine Düşünelim
                            </h4>
                            <p className="text-sm text-purple-700">
                              Hikayeyi kitabınızdan okuduktan sonra bu soruları ailecek tartışın.
                            </p>
                          </div>
                        </div>

                        <ul className="space-y-4">
                          {currentStory.questions.map((q, i) => (
                            <li
                              key={i}
                              className="flex items-start bg-white p-5 rounded-2xl border border-purple-100 shadow-xs hover:border-purple-300 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 text-sm font-bold mr-4 mt-0.5">
                                {i + 1}
                              </div>
                              <span className="text-slate-800 font-medium text-base md:text-lg leading-snug">
                                {q}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: AILE TOPLANTISI ==================== */}
        {activeTab === 'meeting' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Cozy Banner */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 rounded-3xl p-8 border border-amber-200 flex flex-col md:flex-row items-center justify-between shadow-xs relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-amber-200/40 text-9xl pointer-events-none">
                <i className="fas fa-mug-hot"></i>
              </div>
              <div className="relative z-10 mb-4 md:mb-0 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/60 rounded-full text-amber-900 text-xs font-bold mb-3">
                  <i className="fas fa-cookie-bite text-amber-700"></i>
                  Haftalık Aile İstişaresi
                </div>
                <h2 className="text-3xl font-bold text-amber-950 flex items-center mb-2 font-serif">
                  <i className="fas fa-comments text-amber-600 mr-3"></i> Haftalık Aile Toplantısı
                </h2>
                <p className="text-amber-900/90 text-base md:text-lg leading-relaxed">
                  Çayınızı, ıhlamurunuzu ve kurabiyenizi alın; bu hafta neleri iyi yaptık, neleri geliştirmeliyiz birlikte konuşup karara bağlayalım.
                </p>
              </div>

              <div className="flex space-x-6 text-5xl text-amber-600 relative z-10 drop-shadow-sm">
                <span title="Kurabiye">
                  <i className="fas fa-cookie-bite hover:scale-110 transition-transform"></i>
                </span>
                <span title="Çay / Ihlamur">
                  <i className="fas fa-mug-hot hover:scale-110 transition-transform"></i>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Meeting Form */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-amber-600 text-white px-6 py-4 font-bold flex items-center text-lg">
                  <i className="fas fa-pen-nib mr-2"></i> Yeni Toplantı Tutanak Formu
                </div>

                <div className="p-6 md:p-8 space-y-6 flex-grow bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        <i className="far fa-calendar-alt mr-1.5 text-amber-600"></i> Toplantı Tarihi
                      </label>
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-slate-800 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        <i className="fas fa-user-edit mr-1.5 text-amber-600"></i> Raportör (Tutanak Yazan)
                      </label>
                      <select
                        value={meetingReporter}
                        onChange={(e) => setMeetingReporter(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white text-slate-800 shadow-xs"
                      >
                        {familyMembers.length === 0 ? (
                          <option value="">Lütfen önce aile üyesi ekleyin</option>
                        ) : (
                          familyMembers.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      <i className="fas fa-bullhorn mr-1.5 text-amber-600"></i> Gündem: Aile İçi Sorunlar & İhtiyaçlar
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      Bu hafta neleri çözmeliyiz? Hangi konularda yardıma ihtiyacımız var? (Lütfen suçlayıcı olmadan, 'Ben Dili' kullanarak yazın.)
                    </p>
                    <textarea
                      rows={4}
                      value={meetingIssues}
                      onChange={(e) => setMeetingIssues(e.target.value)}
                      placeholder="Örn: Ev işlerinde daha fazla iş birliğine ihtiyacımız olduğunu hissediyorum. Akşamları herkes kendi tabağını kaldırırsa çok rahatlayacağım..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white resize-none text-slate-800 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      <i className="fas fa-handshake mr-1.5 text-amber-600"></i> Alınan Kararlar & Çözümler
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      Birlikte hangi kararları aldık? Sorunları nasıl çözeceğiz?
                    </p>
                    <textarea
                      rows={4}
                      value={meetingDecisions}
                      onChange={(e) => setMeetingDecisions(e.target.value)}
                      placeholder="Örn: 1. Akşam yemeklerinden sonra sofrayı toplama işi sırayla yapılacak. 2. Pazar akşamları 20:00'de telefonlar bırakılıp çay sohbeti yapılacak..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white resize-none text-slate-800 shadow-xs"
                    />
                  </div>

                  <button
                    onClick={handleSaveMeeting}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-600/25 flex items-center justify-center text-lg active:scale-95 cursor-pointer"
                  >
                    <i className="fas fa-save mr-2"></i> Toplantı Tutanaklarını Kaydet
                  </button>
                </div>
              </div>

              {/* Meeting History Sidebar */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center">
                    <i className="fas fa-history mr-2 text-slate-500"></i> Geçmiş Toplantılar
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold">
                    {meetingRecords.length} Tutanak
                  </span>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto flex-grow custom-scrollbar bg-slate-50/40">
                  {meetingRecords.length === 0 ? (
                    <div className="text-center text-slate-400 py-16 italic px-4">
                      <i className="fas fa-folder-open text-4xl mb-3 text-slate-300 block"></i>
                      Henüz kaydedilmiş bir toplantı bulunmuyor. Çayınızı alın ve ilk toplantınızı başlatın!
                    </div>
                  ) : (
                    meetingRecords.map((record) => (
                      <div
                        key={record.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative group animate-fade-in hover:border-amber-300 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                          <div className="font-bold text-amber-800 text-sm flex items-center">
                            <i className="far fa-calendar-alt mr-1.5 text-amber-600"></i>
                            {record.date}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                              Raportör: {record.reporter}
                            </span>
                            <button
                              onClick={() => handleExportMeetingToWord(record)}
                              className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-md shadow-xs transition-colors flex items-center gap-1"
                              title="Word Belgesi (.doc) Olarak İndir"
                            >
                              <i className="fas fa-file-word"></i>
                              <span>Çıktı Al</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMeeting(record.id)}
                              className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                              title="Sil"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <strong className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                            Gündem:
                          </strong>
                          <p className="text-slate-700 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 whitespace-pre-wrap">
                            {record.issues}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[10px] text-amber-700 uppercase tracking-wider block mb-1">
                            Alınan Kararlar:
                          </strong>
                          <p className="text-slate-800 text-xs bg-amber-50/70 text-amber-950 p-2.5 rounded-xl border border-amber-200/50 whitespace-pre-wrap">
                            {record.decisions}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: ILETISIM KOSESI ==================== */}
        {activeTab === 'chat' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 flex items-center mb-2 font-serif">
                <i className="fas fa-hands-holding-heart text-blue-500 mr-3"></i> İletişim Köşesi
              </h2>
              <p className="text-slate-600 text-lg max-w-4xl">
                Aile içinde anlaşmazlıklar doğaldır. Önemli olan sorunları suçlamadan ("Sen Dili") değil, duygularımızı ifade ederek ("Ben Dili") konuşabilmektir.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Theory / Guide Area */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center">
                      <i className="fas fa-balance-scale text-indigo-500 mr-2"></i>
                      Sen Dili vs. Ben Dili Karşılaştırması
                    </h3>
                  </div>

                  <div className="p-6 md:p-8 space-y-5">
                    {/* Sen Dili */}
                    <div className="relative bg-red-50/80 rounded-2xl p-5 border border-red-200">
                      <div className="absolute top-4 right-4">
                        <i className="fas fa-times-circle text-red-500 text-2xl"></i>
                      </div>
                      <h4 className="font-bold text-red-900 mb-1 flex items-center text-base">
                        Sen Dili (Suçlayıcı & Yıkıcı)
                      </h4>
                      <p className="text-red-800/80 text-xs mb-3">
                        Davranışa değil kişiliğe saldırır, karşı tarafı hemen savunmaya veya öfkeye geçirir.
                      </p>
                      <div className="bg-white px-4 py-3 rounded-xl text-slate-700 italic border border-red-100 shadow-xs text-sm">
                        "Beni hiç dinlemiyorsun, sürekli kendi bildiğini okuyorsun! Çok bencilsin."
                      </div>
                    </div>

                    {/* Ben Dili */}
                    <div className="relative bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200">
                      <div className="absolute top-4 right-4">
                        <i className="fas fa-check-circle text-emerald-500 text-2xl"></i>
                      </div>
                      <h4 className="font-bold text-emerald-950 mb-1 flex items-center text-base">
                        Ben Dili (Duygu Odaklı & Yapıcı)
                      </h4>
                      <p className="text-emerald-800/80 text-xs mb-3">
                        Davranışın sizdeki duygusal etkisini söyler, empati kurdurur ve çözüme kapı açar.
                      </p>
                      <div className="bg-white px-4 py-3 rounded-xl text-slate-700 italic border border-emerald-100 shadow-xs text-sm">
                        "Sen konuşurken başka yere baktığında, beni önemsemediğini hissediyorum ve üzülüyorum."
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                      <strong className="block font-bold mb-1">💡 İpucu:</strong>
                      "Ben Dili" formülü basittir: <em>"Sen [Davranış] yaptığında, ben [Duygu] hissediyorum. [İstek] rica ediyorum."</em>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Form: Ben Dili Generator */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full relative">
                <div className="px-6 md:px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-white">
                  <h3 className="font-bold text-slate-800 text-xl flex items-center">
                    <i className="fas fa-magic text-blue-600 mr-2"></i> "Ben Dili" Cümle Sihirbazı
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    Duygularınızı doğru ve kırıcı olmadan ifade etmek için aşağıdaki adımları doldurun.
                  </p>
                </div>

                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md mr-2 text-xs font-bold">
                          1
                        </span>
                        Davranış: (Ne oldu?)
                      </label>
                      <input
                        type="text"
                        value={benBehavior}
                        onChange={(e) => setBenBehavior(e.target.value)}
                        placeholder="Örn: Odaya kapıyı çalmadan girdiğinde..."
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 text-sm shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md mr-2 text-xs font-bold">
                          2
                        </span>
                        Duygu: (Ne hissettin?)
                      </label>
                      <select
                        value={benFeeling}
                        onChange={(e) => setBenFeeling(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 text-sm shadow-xs"
                      >
                        <option value="" disabled>
                          Bir duygu seçin...
                        </option>
                        <option value="üzülüyorum">Üzülüyorum</option>
                        <option value="kızıyorum ve öfkeleniyorum">Kızıyorum / Öfkeleniyorum</option>
                        <option value="kendimi değersiz hissediyorum">Değersiz hissediyorum</option>
                        <option value="kaygılanıyorum ve endişeleniyorum">Kaygılanıyorum</option>
                        <option value="yalnız hissediyorum">Yalnız hissediyorum</option>
                        <option value="hayal kırıklığına uğruyorum">Hayal kırıklığına uğruyorum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md mr-2 text-xs font-bold">
                          3
                        </span>
                        İstek: (Ne istiyorsun?)
                      </label>
                      <input
                        type="text"
                        value={benRequest}
                        onChange={(e) => setBenRequest(e.target.value)}
                        placeholder="Örn: Lütfen bir dahaki sefere kapıyı tıklar mısın?"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 text-sm shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleGenerateBenMessage}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <span>İfademi Oluştur</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>

                    {generatedMessage && (
                      <div className="mt-5 p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 animate-fade-in relative">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            Önerilen Ben Dili Cümlesi:
                          </h4>
                          <button
                            onClick={handleCopyMessage}
                            className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <i className={`fas ${copySuccess ? 'fa-check text-green-600' : 'fa-copy'}`}></i>
                            <span>{copySuccess ? 'Kopyalandı!' : 'Kopyala'}</span>
                          </button>
                        </div>
                        <p className="text-slate-800 font-medium text-lg italic leading-relaxed">
                          "{generatedMessage}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: GÖREVLER ==================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 flex items-center mb-2 font-serif">
                <i className="fas fa-clipboard-list text-green-500 mr-3"></i> Adil Görev Paylaşımı
              </h2>
              <p className="text-slate-600 text-lg">
                Ev işlerini ve sorumlulukları paylaşmak, ailede "biz" duygusunu pekiştirir ve dayanışmayı artırır.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Aile Görev Panosu</h3>
                  <p className="text-xs text-slate-500">
                    Yapılacak işleri ekleyin, aile üyelerine atayın ve tamamlandıkça işaretleyin.
                  </p>
                </div>

                <div className="flex w-full md:w-auto relative max-w-md">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask();
                    }}
                    placeholder="Yeni bir görev yazın (örn: Çiçekleri sulamak)..."
                    className="px-4 py-2.5 pr-20 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm bg-white shadow-xs"
                  />
                  <button
                    onClick={handleAddTask}
                    className="absolute right-1 top-1 bottom-1 bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg font-bold text-xs transition-colors shadow-xs flex items-center cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider font-bold">
                      <th className="p-4 w-16 text-center">Durum</th>
                      <th className="p-4">Görev</th>
                      <th className="p-4 w-72">Sorumlu(lar)</th>
                      <th className="p-4 w-24 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-400 italic">
                          Henüz bir görev eklenmemiş. Yukarıdan yeni görev ekleyip paylaşabilirsiniz!
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task) => (
                        <tr
                          key={task.id}
                          className={`transition-colors ${
                            task.done ? 'bg-slate-50/60' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={() => handleToggleTask(task.id)}
                              className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer accent-green-600"
                            />
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-sm md:text-base ${
                                task.done
                                  ? 'line-through text-slate-400 font-normal'
                                  : 'text-slate-800 font-medium'
                              }`}
                            >
                              {task.text}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {task.assignees.map((assignee) => (
                                <span
                                  key={assignee}
                                  className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-100 inline-flex items-center gap-1"
                                >
                                  <span>{assignee}</span>
                                  <button
                                    onClick={() => handleToggleAssignee(task.id, assignee)}
                                    className="text-indigo-400 hover:text-red-500 text-[10px]"
                                    title="Kaldır"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}

                              <button
                                onClick={() => setAssignModalTaskId(task.id)}
                                className="text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                                title="Kişi Ata"
                              >
                                <i className="fas fa-plus text-[10px]"></i>
                                <span>Ata</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-300 hover:text-red-500 p-2 rounded-full transition-colors cursor-pointer"
                              title="Görevi Sil"
                            >
                              <i className="fas fa-trash-alt text-sm"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Task Member Assignment Popup */}
            {assignModalTaskId !== null && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-fade-in">
                  <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                    <i className="fas fa-user-plus text-indigo-600"></i>
                    Sorumlu Kişi Ata
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Görevi atamak istediğiniz aile üyelerini seçin:
                  </p>

                  {familyMembers.length === 0 ? (
                    <div className="text-center py-4 text-sm text-slate-400">
                      Önce sol üstten aile üyelerini ekleyin.
                    </div>
                  ) : (
                    <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                      {familyMembers.map((member) => {
                        const targetTask = tasks.find((t) => t.id === assignModalTaskId);
                        const isAssigned = targetTask?.assignees.includes(member);
                        return (
                          <button
                            key={member}
                            onClick={() => handleToggleAssignee(assignModalTaskId, member)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between border transition-all ${
                              isAssigned
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                                : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{member}</span>
                            {isAssigned && <i className="fas fa-check text-indigo-600 text-xs"></i>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => setAssignModalTaskId(null)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================== APP FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-home text-indigo-600 text-lg"></i>
              <span className="font-serif font-bold text-slate-800 text-base">
                Aile Bağları: "Aile Dediğin" Platformu
              </span>
              <span className="text-xs text-amber-700 font-semibold ml-2">
                (Bilsem Öğrencilerinin Kaleminden)
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              Sevgi paylaştıkça büyür, aile bağları muhabbetle güçlenir.
            </p>
          </div>
        </div>
      </footer>

      {/* ==================== CUSTOM MODAL (Safe Dialog) ==================== */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-fade-in border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">
              {modalConfig.title}
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {modalConfig.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
