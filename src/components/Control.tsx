import styled from "styled-components";

import Pressable from "./base/Pressable";
import useSudokuStore from "../zustand/useSudokuStore";

function Control() {
  const actionDelete = useSudokuStore((st) => st.actionDelete);
  const actionHint = useSudokuStore((st) => st.actionHint);
  const actionUndo = useSudokuStore((st) => st.actionUndo);
  const noteMode = useSudokuStore((st) => st.noteMode);
  const actionNote = useSudokuStore((st) => st.actionNote);

  return (
    <Wrapper>
      <ItemWrapper>
        <ItemIcon onClick={actionUndo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
          >
            <title>{"Reload"}</title>
            <path
              d="M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit={10}
              strokeWidth={32}
            />
            <path
              fill="currentColor"
              d="M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z"
            />
          </svg>
        </ItemIcon>
        <Label>Hoàn tác</Label>
      </ItemWrapper>
      <ItemWrapper>
        <ItemIcon onClick={actionDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 31">
            <path
              fill="currentColor"
              d="M27.13 25.11a1 1 0 01.12 2h-6.9a1 1 0 01-.11-2h6.89zM21.48 4.08l.17.14.16.15 3.76 3.76a4 4 0 01.15 5.5l-.15.16-11.32 11.32h2.04a1 1 0 011 .89v.11a1 1 0 01-.88 1H6.52a3 3 0 01-1.98-.74l-.14-.14-2.23-2.22a4 4 0 01-.15-5.5l.15-.16L16.15 4.37a4 4 0 015.33-.29zm-11.52 9.3l-6.38 6.38a2 2 0 00-.11 2.7l.11.13 2.23 2.23a1 1 0 00.58.28l.13.01h4.9l5.13-5.13-6.59-6.6zm7.87-7.82l-.14.1-.13.13-6.18 6.18 6.59 6.6 6.19-6.2a2 2 0 00.11-2.7l-.11-.12-3.77-3.76a2 2 0 00-2.56-.22z"
            />
          </svg>
        </ItemIcon>
        <Label>Xoá</Label>
      </ItemWrapper>
      <ItemWrapper>
        <ItemIcon onClick={actionNote} className={noteMode ? "active" : ""}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-edit-3"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </ItemIcon>
        <Label>Ghi chú</Label>
      </ItemWrapper>
      <ItemWrapper>
        <ItemIcon onClick={actionHint}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
          >
            <title>Bulb</title>
            <path
              d="M304 384v-24c0-29 31.54-56.43 52-76 28.84-27.57 44-64.61 44-108 0-80-63.73-144-144-144a143.6 143.6 0 00-144 144c0 41.84 15.81 81.39 44 108 20.35 19.21 52 46.7 52 76v24M224 480h64M208 432h96M256 384V256"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
            />
            <path
              d="M294 240s-21.51 16-38 16-38-16-38-16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
            />
          </svg>
        </ItemIcon>
        <Label>Gợi ý</Label>
      </ItemWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 0 2.5%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 5%;
  margin-bottom: 14px;
  color: var(--color-primary);
`;

const ItemWrapper = styled.div`
  position: relative;
  max-width: 60px;
  flex-basis: 25%;
  flex-grow: 1;
`;

const ItemIcon = styled(Pressable)`
  position: relative;
  border-radius: 50%;
  width: 100%;
  aspect-ratio: 1/1;

  &.active {
    border: 2px solid var(--color-primary);
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 55%;
    color: #344861;
  }
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-top: 5px;
  text-align: center;
  display: block;
  color: var(--color-primary);
`;

export default Control;
