import { useContext } from "react";
import { StatusContext, StatusEnum } from "./TaskContext";

function StatusZone() {
  const [status, setStatus] = useContext(StatusContext)
  const classN = (status.status == StatusEnum.none ? "w-full hidden" : "w-full")
  let headText = ''
  let colorClass = ''
  switch (status.status) {
    case StatusEnum.success:
      headText = 'Поздравляем'
      colorClass = 'font-sans text-base border border-lime-500 rounded-xl px-5 py-4 bg-lime-100'
      break;
    case StatusEnum.error:
      headText = 'Ваша ошибка'
      colorClass = 'font-sans text-base border border-red-500 rounded-xl px-5 py-4 bg-red-100'
      break;
    case StatusEnum.hint:
      headText = 'Подсказка'
      colorClass = 'font-sans text-base border border-yellow-500 rounded-xl px-5 py-4 bg-yellow-100'
  }

  return (
    <div className={classN}>
      <div className="font-sans text-base font-medium">
        {headText}
      </div>
      <div className={colorClass}>
        {status.text}
      </div>
    </div>
  );
}

export default StatusZone;
