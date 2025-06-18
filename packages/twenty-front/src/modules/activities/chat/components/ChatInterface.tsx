import { useLeads } from '@/activities/chat/hooks/useLeads';
import { SkeletonLoader } from '@/activities/components/SkeletonLoader';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import styled from '@emotion/styled';
import { formatDistanceToNow } from 'date-fns';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
  EMPTY_PLACEHOLDER_TRANSITION_PROPS,
} from 'twenty-ui/layout';

const StyledChatContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing(4)};
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledMessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledMessageBubble = styled.div<{ isUser: boolean }>`
  background: ${({ theme, isUser }) =>
    isUser ? theme.color.blue : theme.background.secondary};
  border: 1px solid
    ${({ theme, isUser }) =>
      isUser ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  padding: ${({ theme }) => theme.spacing(3)};
  max-width: 70%;
  word-wrap: break-word;
  position: relative;
`;

const StyledMessageContent = styled.div<{ isUser: boolean }>`
  color: ${({ theme, isUser }) =>
    isUser ? theme.font.color.inverted : theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.md};
  line-height: ${({ theme }) => theme.text.lineHeight.lg};
  white-space: pre-wrap;
`;

const StyledMessageTimestamp = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.xs};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const StyledRoleLabel = styled.div<{ isUser: boolean }>`
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme, isUser }) =>
    isUser ? theme.color.blue : theme.font.color.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-transform: capitalize;
`;

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
};

type ChatInterfaceProps = {
  targetableObject: ActivityTargetableObject;
  messages?: ChatMessage[];
};

export const ChatInterface = ({
  targetableObject,
  messages = [],
}: ChatInterfaceProps) => {
  const { leads, loading: leadsLoading } = useLeads(targetableObject);

  console.log({ targetableObject, leads });

  // Get the first lead and its chat messages
  const firstLead = leads && leads.length > 0 ? leads[0] : null;
  const chatMessages = firstLead?.chat || [];

  const isChatMessagesEmpty = !chatMessages || chatMessages.length === 0;

  // Show loading state while data is being fetched and there are no messages
  if (leadsLoading && isChatMessagesEmpty) {
    return <SkeletonLoader />;
  }

  // Show empty state when not loading and there are no messages
  if (isChatMessagesEmpty) {
    return (
      <AnimatedPlaceholderEmptyContainer
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...EMPTY_PLACEHOLDER_TRANSITION_PROPS}
      >
        <AnimatedPlaceholder type="noNote" />
        <AnimatedPlaceholderEmptyTextContainer>
          <AnimatedPlaceholderEmptyTitle>
            No chat messages
          </AnimatedPlaceholderEmptyTitle>
          <AnimatedPlaceholderEmptySubTitle>
            There are no chat messages associated with this record.
          </AnimatedPlaceholderEmptySubTitle>
        </AnimatedPlaceholderEmptyTextContainer>
      </AnimatedPlaceholderEmptyContainer>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <StyledChatContainer>
      {chatMessages.map((message) => {
        const isUser = message.role === 'user';

        return (
          <StyledMessageContainer key={message.id} isUser={isUser}>
            <StyledRoleLabel isUser={isUser}>{message.role}</StyledRoleLabel>
            <StyledMessageBubble isUser={isUser}>
              <StyledMessageContent isUser={isUser}>
                {message.content}
              </StyledMessageContent>
            </StyledMessageBubble>
            <StyledMessageTimestamp>
              {formatTimestamp(message.timestamp)}
            </StyledMessageTimestamp>
          </StyledMessageContainer>
        );
      })}
    </StyledChatContainer>
  );
};
