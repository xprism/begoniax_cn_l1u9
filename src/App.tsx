import React, { useState, useRef, useEffect } from "react";
import {
  PawPrint,
  Rabbit,
  Cat,
  Dog,
  Bird,
  Star,
  Heart,
  Calendar,
  Map,
  Flag,
  Music,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Printer,
  PenTool,
  Eraser,
} from "lucide-react";

// --- Types & Interfaces (TS Fix: 定义接口以解决 implicit any 警告) ---

type ThemeColor = "blue" | "green" | "purple" | "orange";

interface A4PageProps {
  children: React.ReactNode;
  themeColor?: ThemeColor;
}

interface HeaderProps {
  title: string;
  subTitle: string;
  color?: string;
  borderColor?: string;
}

interface SectionTitleProps {
  number: string | number;
  title: string;
  colorClass?: string;
}

interface WeekCardProps {
  day: string;
  pinyin: string;
  en: string;
  icon: React.ReactNode;
  color: string;
}

interface DesignProps {
  page: number;
}

interface DesignConfig {
  title: string;
  pages: number;
  component: React.FC<DesignProps>;
  color: string;
}

// --- Icons & Assets ---

const PandaIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12">
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="white"
      stroke="black"
      strokeWidth="4"
    />
    <circle cx="30" cy="35" r="8" fill="black" />
    <circle cx="70" cy="35" r="8" fill="black" />
    <ellipse cx="50" cy="60" rx="15" ry="10" fill="black" />
    <circle cx="20" cy="20" r="10" fill="black" />
    <circle cx="80" cy="20" r="10" fill="black" />
  </svg>
);

const FoxIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 text-orange-500 fill-current">
    <path d="M20,20 L50,80 L80,20 L50,40 Z" />
    <circle cx="40" cy="40" r="5" fill="black" />
    <circle cx="60" cy="40" r="5" fill="black" />
  </svg>
);

const FrogIcon: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 text-green-500 fill-current">
    <circle cx="50" cy="50" r="35" />
    <circle cx="30" cy="25" r="10" />
    <circle cx="70" cy="25" r="10" />
    <circle cx="50" cy="60" r="20" fill="white" />
  </svg>
);

// --- Shared Components ---

const A4Page: React.FC<A4PageProps> = ({ children, themeColor = "blue" }) => {
  // TS Fix: 定义具体类型映射，解决索引报错
  const borderColors: Record<ThemeColor, string> = {
    blue: "border-blue-400",
    green: "border-green-400",
    purple: "border-purple-400",
    orange: "border-orange-400",
  };

  return (
    <div
      className={`w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl mb-8 relative flex flex-col ${
        borderColors[themeColor] || "border-gray-200"
      }`}
    >
      {children}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  title,
  subTitle,
  color = "text-blue-500",
  borderColor = "border-blue-400",
}) => (
  <div
    className={`px-10 py-6 border-b-4 ${borderColor} flex justify-between items-end`}
  >
    <div>
      <h3 className="text-orange-400 font-bold uppercase tracking-wider text-sm">
        LingoAce Level 1 Unit 9
      </h3>
      <h1 className={`text-4xl font-bold ${color} mt-2 font-serif`}>{title}</h1>
      <p className="text-gray-500 text-lg">{subTitle}</p>
    </div>
    <div className="flex gap-8 text-gray-500 font-bold font-mono">
      <div className="border-b-2 border-gray-300 w-32 pb-1">Name:</div>
      <div className="border-b-2 border-gray-300 w-32 pb-1">Date:</div>
    </div>
  </div>
);

const SectionTitle: React.FC<SectionTitleProps> = ({
  number,
  title,
  colorClass = "bg-blue-500",
}) => (
  <div className="flex items-center gap-3 mb-6 mt-8 px-10">
    <div
      className={`${colorClass} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-md`}
    >
      {number}
    </div>
    <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
  </div>
);

interface DrawingCanvasProps {
  height?: string;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ height = "h-64" }) => {
  // TS Fix: 指定 useRef 泛型为 HTMLCanvasElement，解决 'never' 错误
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#333";
      }
    }
  }, []);

  // TS Fix: 添加事件类型 React.MouseEvent | React.TouchEvent
  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0]?.clientX;
      clientY = e.touches[0]?.clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    if (!clientX || !clientY) return null;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const ctx = canvasRef.current?.getContext("2d");
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    const coords = getCoordinates(e);
    if (!ctx || !coords) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div
      className={`w-full ${height} border-2 border-dashed border-gray-400 rounded-xl relative bg-white cursor-crosshair overflow-hidden`}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
        className="w-full h-full"
      />
      <button
        onClick={clearCanvas}
        className="absolute top-2 right-2 text-gray-600 bg-white/80 p-1 rounded hover:bg-red-100 transition shadow-md"
        title="Clear Drawing"
      >
        <Eraser size={16} />
      </button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-300 font-bold text-2xl select-none pointer-events-none">
        画一画 (Draw Here)
      </div>
    </div>
  );
};

// --- Design 1: PawPrint's Parade ---

const WeekCard: React.FC<WeekCardProps> = ({
  day,
  pinyin,
  en,
  icon,
  color,
}) => (
  <div
    className={`border-2 ${color} rounded-2xl p-4 flex flex-col items-center justify-between h-48 bg-white shadow-sm hover:shadow-md transition-shadow`}
  >
    <div className="text-gray-600 scale-125 pt-2">{icon}</div>
    <div className="text-center">
      <p className="text-gray-500 text-sm mb-1">{pinyin}</p>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{day}</h3>
      <p className="text-gray-400 text-xs font-bold uppercase">{en}</p>
    </div>
  </div>
);

const Design1_PawPrint: React.FC<DesignProps> = ({ page }) => {
  const days: WeekCardProps[] = [
    {
      day: "星期一",
      pinyin: "xīng qī yī",
      en: "Monday",
      icon: <PawPrint size={40} />,
      color: "border-red-200",
    },
    {
      day: "星期二",
      pinyin: "xīng qī èr",
      en: "Tuesday",
      icon: <Rabbit size={40} />,
      color: "border-orange-200",
    },
    {
      day: "星期三",
      pinyin: "xīng qī sān",
      en: "Wednesday",
      icon: <FrogIcon />,
      color: "border-yellow-200",
    },
    {
      day: "星期四",
      pinyin: "xīng qī sì",
      en: "Thursday",
      icon: <PandaIcon />,
      color: "border-green-200",
    },
    {
      day: "星期五",
      pinyin: "xīng qī wǔ",
      en: "Friday",
      icon: <FoxIcon />,
      color: "border-blue-200",
    },
    {
      day: "星期六",
      pinyin: "xīng qī liù",
      en: "Saturday",
      icon: <Cat size={40} />,
      color: "border-indigo-200",
    },
    {
      day: "星期天",
      pinyin: "xīng qī tiān",
      en: "Sunday",
      icon: <Star size={40} className="text-yellow-400 fill-current" />,
      color: "border-purple-200",
    },
  ];

  if (page === 1) {
    return (
      <A4Page themeColor="blue">
        <Header
          title="Animal Week Parade"
          subTitle="小动物的一周游行"
          color="text-blue-500"
          borderColor="border-blue-400"
        />
        <SectionTitle
          number="1"
          title="Flashcards (读一读，记一记)"
          colorClass="bg-blue-500"
        />
        <div className="px-10 grid grid-cols-3 gap-6">
          {days.map((d, i) => (
            <WeekCard key={i} {...d} />
          ))}
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
          Page 1
        </div>
      </A4Page>
    );
  }

  if (page === 2) {
    return (
      <A4Page themeColor="blue">
        <Header
          title="Animal Week Parade"
          subTitle="小动物的一周游行"
          color="text-blue-500"
          borderColor="border-blue-400"
        />

        <SectionTitle
          number="2"
          title="Order the Days (给星期排排队)"
          colorClass="bg-blue-500"
        />
        <div className="px-10 mb-10">
          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 border-dashed grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-center relative"
              >
                <span className="absolute top-1 left-2 text-gray-300 font-bold">
                  {i + 1}
                </span>
                <div className="w-16 h-8 border-b-2 border-gray-200 mt-8"></div>
                <span className="text-xs text-gray-400 mt-2">Write here</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-gray-500 italic">
            Put "星期一" to "星期天" in the correct order.
          </p>
        </div>

        <SectionTitle
          number="3"
          title="Match (连一连)"
          colorClass="bg-blue-500"
        />
        <div className="px-10 flex justify-between items-center">
          <div className="flex flex-col gap-12">
            <div className="flex items-center gap-4 border-2 border-gray-200 p-3 rounded-lg">
              <PawPrint /> 小熊
            </div>
            <div className="flex items-center gap-4 border-2 border-gray-200 p-3 rounded-lg">
              <Rabbit /> 小兔
            </div>
            <div className="flex items-center gap-4 border-2 border-gray-200 p-3 rounded-lg">
              <PandaIcon /> 熊猫
            </div>
          </div>

          <div className="flex-grow h-64 relative mx-4">
            <svg className="w-full h-full absolute inset-0 text-gray-300">
              <path
                d="M10,30 C100,30 100,150 200,150"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path
                d="M10,100 C100,100 100,30 200,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path
                d="M10,170 C100,170 100,100 200,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-12">
            <div className="bg-yellow-100 p-3 rounded-lg text-center font-bold text-gray-700">
              星期五
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-center font-bold text-gray-700">
              星期天
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-center font-bold text-gray-700">
              星期一
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
          Page 2
        </div>
      </A4Page>
    );
  }

  if (page === 3) {
    return (
      <A4Page themeColor="blue">
        <Header
          title="Animal Week Parade"
          subTitle="小动物的一周游行"
          color="text-blue-500"
          borderColor="border-blue-400"
        />

        <SectionTitle
          number="4"
          title="Sentences (写句子)"
          colorClass="bg-blue-500"
        />
        <div className="px-10 space-y-8 mb-10">
          <div className="flex items-center gap-4 text-xl">
            <span className="text-gray-500 w-24">Yesterday:</span>
            昨天是{" "}
            <input
              className="border-b-2 border-gray-400 w-40 text-center text-blue-600 focus:outline-none font-kaiti"
              placeholder="星期?"
            />{" "}
            。
          </div>
          <div className="flex items-center gap-4 text-xl">
            <span className="text-gray-500 w-24">Today:</span>
            今天是{" "}
            <input
              className="border-b-2 border-gray-400 w-40 text-center text-blue-600 focus:outline-none font-kaiti"
              placeholder="星期?"
            />{" "}
            。
          </div>
          <div className="flex items-center gap-4 text-xl">
            <span className="text-gray-500 w-24">Tomorrow:</span>
            明天是{" "}
            <input
              className="border-b-2 border-gray-400 w-40 text-center text-blue-600 focus:outline-none font-kaiti"
              placeholder="星期?"
            />{" "}
            。
          </div>
        </div>

        <SectionTitle
          number="5"
          title="Writing & Drawing (写一写，画一画)"
          colorClass="bg-blue-500"
        />
        <div className="px-10">
          <div className="mb-4 text-xl text-center">
            我最喜欢{" "}
            <span className="inline-block border-b-2 border-blue-400 w-32"></span>
            ， 因为{" "}
            <span className="inline-block border-b-2 border-blue-400 w-full mt-2"></span>
            。
            <div className="text-sm text-gray-400 mt-1">
              (I like... best, because...)
            </div>
          </div>
          <DrawingCanvas height="h-64" />
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
          Page 3
        </div>
      </A4Page>
    );
  }

  return null;
};

// --- Design 2: Panda Zoo ---

const Design2_Panda: React.FC<DesignProps> = ({ page }) => {
  if (page === 1) {
    return (
      <A4Page themeColor="green">
        <Header
          title="Zoo Timetable"
          subTitle="动物乐园时间表"
          color="text-green-600"
          borderColor="border-green-500"
        />

        <SectionTitle
          number="1"
          title="Mini Calendar (小日历)"
          colorClass="bg-green-600"
        />
        <div className="px-10 mb-8">
          <div className="grid grid-cols-7 gap-2 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="bg-green-100 py-1 font-bold text-green-800 rounded-t-lg"
              >
                {d}
              </div>
            ))}
            {["一", "二", "三", "四", "五", "六", "天"].map((d, i) => (
              <div
                key={i}
                className="border border-green-200 h-24 flex flex-col justify-center items-center hover:bg-green-50"
              >
                <span className="text-2xl font-bold text-gray-700">{d}</span>
                <span className="text-xs text-gray-400">星期{d}</span>
              </div>
            ))}
          </div>
        </div>

        <SectionTitle
          number="2"
          title="Flashcards (认一认)"
          colorClass="bg-green-600"
        />
        <div className="px-10 grid grid-cols-2 gap-6">
          <div className="border border-green-300 rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm">
            <PandaIcon />
            <div>
              <h3 className="text-xl font-bold">熊猫</h3>
              <p className="text-gray-500">xióng māo</p>
              <p className="text-xs text-gray-400">Panda</p>
            </div>
          </div>
          <div className="border border-green-300 rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm">
            <FoxIcon />
            <div>
              <h3 className="text-xl font-bold">狐狸</h3>
              <p className="text-gray-500">hú li</p>
              <p className="text-xs text-gray-400">Fox</p>
            </div>
          </div>
          <div className="border border-green-300 rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm">
            <Rabbit />
            <div>
              <h3 className="text-xl font-bold">兔子</h3>
              <p className="text-gray-500">tù zi</p>
              <p className="text-xs text-gray-400">Rabbit</p>
            </div>
          </div>
          <div className="border border-green-300 rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm">
            <PawPrint />
            <div>
              <h3 className="text-xl font-bold">小熊</h3>
              <p className="text-gray-500">xiǎo xióng</p>
              <p className="text-xs text-gray-400">Bear</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
          Page 1
        </div>
      </A4Page>
    );
  }

  if (page === 2) {
    interface TableRow {
      id: string;
      day: string;
      icon: React.ReactNode;
      act: string;
      hint: boolean;
    }

    const tableData: TableRow[] = [
      {
        id: "mon",
        day: "星期一",
        icon: <PandaIcon />,
        act: "学中文 (Learn Chinese)",
        hint: false,
      },
      {
        id: "tue",
        day: "星期___",
        icon: <FoxIcon />,
        act: "画画 (Drawing)",
        hint: true,
      },
      {
        id: "wed",
        day: "星期___",
        icon: <Rabbit />,
        act: "跳舞 (Dance)",
        hint: true,
      },
      {
        id: "thu",
        day: "星期___",
        icon: <PawPrint />,
        act: "去公园 (Go to park)",
        hint: true,
      },
    ];

    return (
      <A4Page themeColor="green">
        <Header
          title="Zoo Timetable"
          subTitle="动物乐园时间表"
          color="text-green-600"
          borderColor="border-green-500"
        />

        <SectionTitle
          number="3"
          title="Fill the Schedule (填一填)"
          colorClass="bg-green-600"
        />
        <div className="px-10 mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100">
                <th className="border border-green-300 p-2 text-green-800">
                  Time (时间)
                </th>
                <th className="border border-green-300 p-2 text-green-800">
                  Who (谁)
                </th>
                <th className="border border-green-300 p-2 text-green-800">
                  Activity (做什么)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-200">
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td
                    className={`border border-green-300 p-4 font-bold text-center ${
                      row.hint ? "text-gray-400 italic" : ""
                    }`}
                  >
                    {row.day}
                  </td>
                  <td className="border border-green-300 p-4 text-center">
                    {row.icon}
                  </td>
                  <td className="border border-green-300 p-4 text-center">
                    {row.act}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SectionTitle
          number="4"
          title="Make Sentences (造句)"
          colorClass="bg-green-600"
        />
        <div className="px-10 bg-green-50 mx-10 p-6 rounded-xl border border-green-200">
          <p className="mb-4 font-bold text-gray-700">
            Example: 熊猫星期一学中文。
          </p>
          <div className="space-y-6">
            <div className="flex gap-2 items-end">
              1. 小狐狸 <div className="border-b-2 border-gray-400 w-32"></div>{" "}
              画画。
            </div>
            <div className="flex gap-2 items-end">
              2. 小兔 <div className="border-b-2 border-gray-400 w-32"></div>{" "}
              跳舞。
            </div>
            <div className="flex gap-2 items-end">
              3. <div className="border-b-2 border-gray-400 w-full"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
          Page 2
        </div>
      </A4Page>
    );
  }
  return null;
};

// --- Design 3: Fox Hunt ---

const Design3_Fox: React.FC<DesignProps> = ({ page }) => {
  if (page === 1) {
    return (
      <A4Page themeColor="orange">
        <Header
          title="Treasure Hunt"
          subTitle="星期寻宝大冒险"
          color="text-orange-600"
          borderColor="border-orange-500"
        />

        <SectionTitle
          number="1"
          title="Treasure Map (寻宝路线)"
          colorClass="bg-orange-500"
        />
        <div className="px-10 relative h-96 mb-8 bg-orange-50 rounded-xl mx-10 border-2 border-orange-200 border-dashed overflow-hidden">
          {/* SVG Map Path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <path
              d="M50,50 Q100,50 150,100 T250,150 T350,250"
              fill="none"
              stroke="#FDBA74"
              strokeWidth="8"
              strokeDasharray="10,10"
            />

            {/* Stops */}
            <circle cx="50" cy="50" r="15" fill="#F97316" />
            <text
              x="50"
              y="30"
              textAnchor="middle"
              fontSize="12"
              fill="#C2410C"
            >
              Mon
            </text>

            <circle cx="150" cy="100" r="15" fill="#F97316" />
            <text
              x="150"
              y="80"
              textAnchor="middle"
              fontSize="12"
              fill="#C2410C"
            >
              Wed
            </text>

            <circle cx="250" cy="150" r="15" fill="#F97316" />
            <text
              x="250"
              y="130"
              textAnchor="middle"
              fontSize="12"
              fill="#C2410C"
            >
              Fri
            </text>

            <rect x="330" y="230" width="40" height="40" fill="#F59E0B" />
            <text
              x="350"
              y="220"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
            >
              Sunday Treasure!
            </text>
          </svg>

          <div className="absolute bottom-4 left-4 text-xs text-orange-800 bg-white p-2 rounded shadow">
            Follow the path: 星期一 &gt; 星期三 &gt; 星期五 &gt; 星期天
          </div>
        </div>

        <SectionTitle
          number="2"
          title="DIY Flashcards (自己做卡片)"
          colorClass="bg-orange-500"
        />
        <div className="px-10 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-64 border-4 border-gray-300 rounded-xl bg-white relative p-4 flex flex-col items-center gap-2"
            >
              <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-300">
                Draw
              </div>
              <div className="w-full border-b border-gray-300 mt-2"></div>
              <div className="w-full border-b border-gray-300 mt-4"></div>
              <div className="w-full border-b border-gray-300 mt-4"></div>
              <span className="absolute -top-3 -right-3 bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow">
                {i}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
          Page 1
        </div>
      </A4Page>
    );
  }

  if (page === 2) {
    return (
      <A4Page themeColor="orange">
        <Header
          title="Treasure Hunt"
          subTitle="星期寻宝大冒险"
          color="text-orange-600"
          borderColor="border-orange-500"
        />

        <SectionTitle
          number="3"
          title="Reading (读一读)"
          colorClass="bg-orange-500"
        />
        <div className="px-10 mb-8">
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
            <h3 className="text-xl font-bold text-center mb-4 text-orange-800">
              小狐狸的一周 (Fox's Week)
            </h3>
            <p className="leading-loose text-lg text-gray-700">
              我是小狐狸。
              <br />
              <span className="font-bold text-orange-600">星期一</span>
              ，我在家读书。
              <br />
              <span className="font-bold text-orange-600">星期三</span>
              ，我和朋友说中文。
              <br />
              <span className="font-bold text-orange-600">星期五</span>
              ，我去上中文课。
              <br />
              <span className="font-bold text-orange-600">星期天</span>
              ，我休息，听中文歌。
              <br />
              我喜欢我的一周！
            </p>
          </div>
        </div>

        <SectionTitle
          number="4"
          title="Questions (想一想)"
          colorClass="bg-orange-500"
        />
        <div className="px-10 space-y-6">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-gray-700">
              1. 星期一，小狐狸做什么？(What does Fox do on Monday?)
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="q1" /> 读书 (Reading)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="q1" /> 睡觉 (Sleeping)
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold text-gray-700">
              2. 小狐狸哪天去上中文课？(When is Chinese class?)
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="q2" /> 星期三
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="q2" /> 星期五
              </label>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <p className="font-bold text-gray-700 mb-2">
              3. Write your own (写一写):
            </p>
            <p>
              我和小狐狸，{" "}
              <span className="border-b-2 border-gray-400 px-8"></span> (which
              day?) 一起玩。
            </p>
          </div>
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
          Page 2
        </div>
      </A4Page>
    );
  }
  return null;
};

// --- Main App Controller ---

const App: React.FC = () => {
  const [currentDesign, setCurrentDesign] = useState<
    "pawprint" | "panda" | "fox"
  >("pawprint");
  const [page, setPage] = useState(1);

  const designs: Record<string, DesignConfig> = {
    pawprint: {
      title: "🐾 Animal Parade",
      pages: 3,
      component: Design1_PawPrint,
      color: "bg-blue-500",
    },
    panda: {
      title: "🐼 Zoo Timetable",
      pages: 2,
      component: Design2_Panda,
      color: "bg-green-600",
    },
    fox: {
      title: "🦊 Treasure Hunt",
      pages: 2,
      component: Design3_Fox,
      color: "bg-orange-500",
    },
  };

  const CurrentComponent = designs[currentDesign].component;

  const changeDesign = (key: "pawprint" | "panda" | "fox") => {
    setCurrentDesign(key);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => changeDesign("pawprint")}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                currentDesign === "pawprint"
                  ? "bg-blue-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-500 hover:bg-blue-100"
              }`}
            >
              <PawPrint size={18} /> PawPrint Parade
            </button>
            <button
              onClick={() => changeDesign("panda")}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                currentDesign === "panda"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-500 hover:bg-green-100"
              }`}
            >
              <PandaIcon /> Zoo Schedule
            </button>
            <button
              onClick={() => changeDesign("fox")}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                currentDesign === "fox"
                  ? "bg-orange-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-500 hover:bg-orange-100"
              }`}
            >
              <FoxIcon /> Treasure Hunt
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 font-mono">
              Page {page} of {designs[currentDesign].pages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={page === designs[currentDesign].pages}
                onClick={() =>
                  setPage((p) => Math.min(designs[currentDesign].pages, p + 1))
                }
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              onClick={() => window.print()}
              className="ml-4 p-2 text-gray-500 hover:text-blue-600"
              title="Print this page"
            >
              <Printer />
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-grow p-8 overflow-y-auto print:p-0 print:overflow-visible">
        <div className="print:hidden mb-4 text-center text-gray-400 text-sm">
          Tip: Click the Printer icon to save as PDF! (Designed for A4)
        </div>
        <CurrentComponent page={page} />
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white; }
          nav, .print\\:hidden { display: none !important; }
          .shadow-xl { shadow: none !important; }
        }
        /* Global Chinese Font Fix */
        body {
          font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
        }
        /* Handwritten font simulation for inputs */
        .font-kaiti {
          font-family: "KaiTi", "STKaiti", "Noto Sans SC", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default App;
