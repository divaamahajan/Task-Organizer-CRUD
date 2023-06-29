// import "./DateCard.css";
import Card from "./Card";
function DateCard({ date }) {
  const fullDate = new Date(date);
  const month = fullDate.toLocaleString("en-US", { month: "long" });
  const day = fullDate.toLocaleString("en-US", { day: "2-digit" });
  const year = fullDate.getFullYear();
  return (
    <Card className="expense-date">
      <div className="expense-date__month">{month}</div>
      <div className="expense-date__day">{day}</div>
      <div className="expense-date__year">{year}</div>
    </Card>
  );
}

export default DateCard;
