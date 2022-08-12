import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Timeline } from '@components/DevstreamTimeline';
import { MergedTimeline } from '@components/MergedTimeline';
import { VistualizedTimeline } from '@components/VistualizedTimeline';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/devstream"
          component={() => <Timeline data={[]} />}
        />
        <Route exact path="/virtualized" component={VistualizedTimeline} />
        <Route exact path="/merged" component={MergedTimeline} />
      </Switch>
    </BrowserRouter>
  );
};

export { Routes };
