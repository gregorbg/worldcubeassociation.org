"use client";

import { WCA_EVENT_IDS } from "@/lib/wca/data/events";
import {
  Button,
  ButtonGroup,
  CheckboxCard,
  CheckboxGroup,
  Fieldset,
  Stack,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useT } from "@/lib/i18n/useI18n";
import { Tooltip } from "@/components/ui/tooltip";
import EventIcon from "@/components/EventIcon";

interface EventCheckboxGroupProps {
  eventList?: string[];
  selectedEvents: string[];
  onEventClick: (eventId: string) => void;
  disabled?: boolean;
  eventButtonsCompact?: boolean;
  maxEvents?: number;
  eventsDisabled?: string[];
  disabledText?: (eventId: string) => string;
}

export function EventCheckboxGroup({
  eventList = WCA_EVENT_IDS,
  selectedEvents,
  onEventClick,
  disabled = false,
  eventButtonsCompact = false,
  maxEvents = Infinity,
  eventsDisabled = [],
  disabledText = () => "",
}: EventCheckboxGroupProps) {
  const { t } = useT();

  return (
    <CheckboxGroup
      defaultValue={selectedEvents}
      disabled={disabled}
      flexDirection="row"
    >
      {eventList.map((eventId) => {
        const currentEventSelected = selectedEvents.includes(eventId);
        const currentEventDisabled = eventsDisabled.includes(eventId);

        const isDisabled =
          disabled ||
          (!currentEventSelected && selectedEvents.length >= maxEvents) ||
          currentEventDisabled;

        return (
          <CheckboxCard.Root
            key={eventId}
            value={eventId}
            variant="surface"
            colorPalette="green"
            align="center"
            disabled={isDisabled}
            size={eventButtonsCompact ? "sm" : undefined}
            checked={currentEventSelected}
            onCheckedChange={() => onEventClick(eventId)}
          >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <Tooltip
                  content={
                    currentEventDisabled
                      ? disabledText(eventId)
                      : t(`events.${eventId}`)
                  }
                  openDelay={200}
                >
                  <EventIcon
                    eventId={eventId}
                    fontSize="2xl"
                    color={currentEventDisabled ? "#FFBBBB" : undefined}
                  />
                </Tooltip>
                <VisuallyHidden>
                  <CheckboxCard.Label>
                    {t(`events.${eventId}`)}
                  </CheckboxCard.Label>
                </VisuallyHidden>
              </CheckboxCard.Content>
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        );
      })}
    </CheckboxGroup>
  );
}

interface EventSelectorProps extends EventCheckboxGroupProps {
  title: string;
  onAllClick?: () => void;
  onClearClick?: () => void;
  showBreakBeforeButtons?: boolean;
}

export default function EventSelector({
  title,
  eventList = WCA_EVENT_IDS,
  selectedEvents,
  onEventClick,
  onAllClick = undefined,
  onClearClick = undefined,
  disabled = false,
  showBreakBeforeButtons = true,
  eventButtonsCompact = false,
  maxEvents = Infinity,
  eventsDisabled = [],
  disabledText = () => "",
}: EventSelectorProps) {
  const { t } = useT();

  return (
    <Fieldset.Root>
      <Fieldset.Legend textStyle="label" asChild>
        <Stack align="baseline" direction={showBreakBeforeButtons ? "column" : "row"}>
          {title}
          <ButtonGroup size="sm">
            {onAllClick !== undefined && (
              <Tooltip
                disabled={!Number.isFinite(maxEvents)}
                content={t(
                  "competitions.registration_v2.register.event_limit",
                  {
                    max_events: maxEvents,
                  },
                )}
              >
                <Button
                  disabled={disabled || eventList.length >= maxEvents}
                  onClick={onAllClick}
                  colorPalette="blue"
                >
                  {t("competitions.index.all_events")}
                </Button>
              </Tooltip>
            )}
            {onClearClick !== undefined && (
              <Button
                onClick={onClearClick}
                colorPalette="blue"
                variant="outline"
              >
                {t("competitions.index.clear")}
              </Button>
            )}
          </ButtonGroup>
        </Stack>
      </Fieldset.Legend>
      <EventCheckboxGroup
        eventList={eventList}
        selectedEvents={selectedEvents}
        onEventClick={onEventClick}
        disabled={disabled}
        eventButtonsCompact={eventButtonsCompact}
        maxEvents={maxEvents}
        eventsDisabled={eventsDisabled}
        disabledText={disabledText}
      />
    </Fieldset.Root>
  );
}
