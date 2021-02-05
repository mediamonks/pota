import { observer } from 'mobx-react-lite';
import { useGlobalStore } from '../../../GlobalStore';
import { StyledCounterButton, StyledCounterValue, StyledCounterContainer } from './Counter.styles';

export default observer(function Counter() {
  const store = useGlobalStore();

  return (
    <StyledCounterContainer>
      <StyledCounterButton type="button" onClick={store.increment}>
        Increment
      </StyledCounterButton>
      <StyledCounterValue>Value: {store.count}</StyledCounterValue>
      <StyledCounterButton type="button" onClick={store.decrement}>
        Decrement
      </StyledCounterButton>
    </StyledCounterContainer>
  );
});
