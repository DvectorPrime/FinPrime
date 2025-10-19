import { Transaction } from "@/app/api/transactions/route";
import { FaEllipsisVertical } from "react-icons/fa6";
import { TiArrowDown, TiArrowUp } from "react-icons/ti";

interface TransactionListProp {
  data:  Transaction
}

export default function TransactionList({data} : TransactionListProp){

    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(data.amount);

    const amountString = `${data.type === "expense" ? "-" : "+"}${formattedAmount}`;

    return(
        <li>
            <div>
              <p>{formattedDate}</p>
              <h5>{data.transactionName}</h5>
              <p>{data.category}</p>
            </div>
            <div>
              <FaEllipsisVertical />
              <div>
                {data.type === "income" ? <TiArrowUp /> : <TiArrowDown />}
                <p>{amountString}</p>
              </div>
            </div>
        </li>
    )
}