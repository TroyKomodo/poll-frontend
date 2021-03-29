const getPollQuery = `
query getPoll($id: String!){
  poll(id: $id) {
    id
    title
    expiry
    multi_answer
    created_at
    options {
      title
    }
  }
}
`;

const getDraftQuery = `
query getDraft($id: String!){
  draft(id: $id) {
    id
    title
    expiry
    multi_answer
    created_at
    options
    check_ip
  }
}
`;

const getPollVotesQuery = `
query getPoll($id: String!){
  poll(id: $id) {
    id
    title
    expiry
    multi_answer
    created_at
    options {
      title
      votes
    }
  }
}
`;

const getPollVotesSubscriptionQuery = `
subscription getPoll($id: String!){
  watch(id: $id) {
    options {
      title
      votes
    }
  }
}
`;

const castPollVoteQuery = `
mutation votePoll($id: String!, $selection: [Int!]!){
  vote(id: $id, selection: $selection)
}
`;

const createPollQuery = `
mutation newPoll($poll: PollInput!){
  new(poll: $poll) {
    state
    poll {
        id
    }
  }
}
`;

const createDraftQuery = `
mutation newDraft($poll: PollInput!){
  newDraft(poll: $poll) {
    state
    poll {
        id
    }
  }
}
`;

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function getPoll(app: any, id: string) {
  const query = {
    query: getPollQuery,
    variables: {
      id,
    },
    request_id: makeid(15),
  };
  if (app.$ws) {
    return await new Promise((resolve) => {
      const cb = (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        if (data.request_id === query.request_id) {
          app.$ws.off("message", cb);
          resolve(data.payload.data.poll);
        }
      };
      app.$ws.on("message", cb);
      app.$ws.Send(JSON.stringify(query));
    });
  }
  return (await app.$axios.post(process.env.QUERY_URL!, query)).data.data.poll;
}

export async function getDraft(app: any, id: string) {
  const query = {
    query: getDraftQuery,
    variables: {
      id,
    },
    request_id: makeid(15),
  };
  if (app.$ws) {
    return await new Promise((resolve) => {
      const cb = (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        if (data.request_id === query.request_id) {
          app.$ws.off("message", cb);
          resolve(data.payload.data.draft);
        }
      };
      app.$ws.on("message", cb);
      app.$ws.Send(JSON.stringify(query));
    });
  }
  return (await app.$axios.post(process.env.QUERY_URL!, query)).data.data.draft;
}

export async function getPollVotes(app: any, id: string) {
  const query = {
    query: getPollVotesQuery,
    variables: {
      id,
    },
    request_id: makeid(15),
  };
  if (app.$ws) {
    return await new Promise((resolve) => {
      const cb = (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        if (data.request_id === query.request_id) {
          app.$ws.off("message", cb);
          resolve(data.payload.data.poll);
        }
      };
      app.$ws.on("message", cb);
      app.$ws.Send(JSON.stringify(query));
    });
  }
  return (await app.$axios.post(process.env.QUERY_URL!, query)).data.data.poll;
}

export function getPollVotesSubscribe(
  app: any,
  id: string,
  callback: (data: any) => void
) {
  const query = {
    query: getPollVotesSubscriptionQuery,
    variables: {
      id,
    },
    request_id: makeid(15),
  };
  if (app.$ws) {
    let subID: string;
    const cb = (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      if (data.request_id === query.request_id) {
        subID = data.payload.data.sub_id;
        callback(data.payload.data.watch.options);
      }
    };
    app.$ws.on("message", cb);
    const openCB = () => {
      app.$ws.Send(JSON.stringify(query));
    };
    app.$ws.on("open", openCB);
    app.$ws.Send(JSON.stringify(query));
    return () => {
      app.$ws.off("message", cb);
      app.$ws.off("open", openCB);
      app.$ws.Send(
        JSON.stringify({
          sub_id: subID,
          operation_name: "unsubscribe",
        })
      );
    };
  }
}

export async function castVote(app: any, id: string, selection: number[]) {
  const query = {
    query: castPollVoteQuery,
    variables: {
      id,
      selection,
    },
    request_id: makeid(15),
  };
  if (app.$ws) {
    return await new Promise((resolve) => {
      const cb = (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        if (data.request_id === query.request_id) {
          app.$ws.off("message", cb);
          resolve(data.payload.data.vote);
        }
      };
      app.$ws.on("message", cb);
      app.$ws.Send(JSON.stringify(query));
    });
  }
  return (await app.$axios.post(process.env.QUERY_URL!, query)).data.data.vote;
}

export async function createNewPoll(
  app: any,
  title: string,
  checkIP: boolean,
  multiAnswer: boolean,
  expiry: number | undefined,
  options: string[]
) {
  const query = {
    query: createPollQuery,
    variables: {
      poll: {
        title,
        options,
        check_ip: checkIP,
        multi_answer: multiAnswer,
        expiry,
      },
    },
    request_id: makeid(15),
  };
  if (app.$ws) {
    return await new Promise((resolve) => {
      const cb = (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        if (data.request_id === query.request_id) {
          app.$ws.off("message", cb);
          resolve(data.payload.data.new);
        }
      };
      app.$ws.on("message", cb);
      app.$ws.Send(JSON.stringify(query));
    });
  }
  return (await app.$axios.post(process.env.QUERY_URL!, query)).data.data.new;
}

export async function createNewDraft(
  app: any,
  title: string,
  checkIP: boolean,
  multiAnswer: boolean,
  expiry: number | undefined,
  options: string[]
) {
  const query = {
    query: createDraftQuery,
    variables: {
      poll: {
        title,
        options,
        check_ip: checkIP,
        multi_answer: multiAnswer,
        expiry,
      },
    },
    request_id: makeid(15),
  };
  if (app.$ws) {
    return await new Promise((resolve) => {
      const cb = (ev: MessageEvent) => {
        const data = JSON.parse(ev.data);
        if (data.request_id === query.request_id) {
          app.$ws.off("message", cb);
          resolve(data.payload.data.newDraft);
        }
      };
      app.$ws.on("message", cb);
      app.$ws.Send(JSON.stringify(query));
    });
  }
  return (await app.$axios.post(process.env.QUERY_URL!, query)).data.data
    .newDraft;
}
