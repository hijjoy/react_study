import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();

  // useMutation은 useQuery와 다르게 랜더링될때  자동으로 요청을 보내지 않음
  const { mutate, isPending, isError, error } = useMutation({
    //mutate로 언제 요청을 보낼지 설정
    // mutationKey는 반드시 필요하진 않음 -> 캐시처리하는거 아니니까
    mutationFn: createNewEvent, // () = createNewEvent(data) 형태가 아님
    onSuccess: () => {
      // 변형이 성공한 경우에만 아래 코드 실행
      queryClient.invalidateQueries({ queryKey: ["events"] }); // 쿼리 무효화 => 데이터 오래됐으니 만료로 표시 다시 트리거 해야한다고 알려줘
      // exact: true 써주는 경우 정확히 쿼리키랑 일치하는 것만, 안써주면 ["events", "어찌구"] 이런것도 다 무효화됨
      navigate("/events");
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData }); // { event: formData } 는 지금 강의에서 데이터 형태
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "제출중 ..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="생성 실패"
          message={error.info?.message || "생성 실패"}
        />
      )}
    </Modal>
  );
}
