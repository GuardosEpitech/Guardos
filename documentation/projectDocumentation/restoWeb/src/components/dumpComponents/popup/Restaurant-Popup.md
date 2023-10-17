PopupProps:
-----------

```java
type PopupProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};
```

PopupContainer:
---------------

```java
const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 150px;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
```

PopupButton:
------------

```java
const PopupButton = styled.button`
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #6D071A;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;
```

Popup:
------

```java
export const Popup: React.FC<PopupProps> = (
  { message, onConfirm, onCancel }) => {
  return (
    <PopupContainer>
      <div>{message}</div>
      <div>
        <PopupButton onClick={onConfirm}>Confirm</PopupButton>
        <PopupButton onClick={onCancel}>Cancel</PopupButton>
      </div>
    </PopupContainer>
  );
};
```