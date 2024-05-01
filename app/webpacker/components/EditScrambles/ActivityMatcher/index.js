import React from 'react';
import {
  Button,
  Icon,
  Label,
  List,
  Segment,
} from 'semantic-ui-react';

function NestedActivityLabels({ activities }) {
  return (
    activities.map((act) => (
      <List.Item key={act.id}>
        <Label as={act.childActivities.length === 0 && 'a'}>{act.name}</Label>
        {act.childActivities.length > 0 && (
          <List.List>
            <NestedActivityLabels activities={act.childActivities} />
          </List.List>
        )}
      </List.Item>
    ))
  );
}

export default function ActivityMatcher({ activities }) {
  return (
    <Segment basic>
      <List>
        <NestedActivityLabels activities={activities} />
      </List>
      <Button fluid icon primary labelPosition="left">
        <Icon name="lightbulb outline" />
        Auto-assign
      </Button>
    </Segment>
  );
}
