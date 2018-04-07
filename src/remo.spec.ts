import * as assert from 'assert';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { RemoClient } from './remo';

describe('RemoClient', function () {
  const client = new RemoClient("");
  const mock = new MockAdapter(axios);

  describe('fetchMe', function () {
    describe('正常系', () => {
      beforeEach(() => {
        mock.onGet('/users/me').reply(200, {
          id: 'test_id',
          nickname: 'test_nickname'
        });
      });

      it('正常にレスポンスを返すこと', () => {
        return client.fetchMe().then(res => {
          assert.equal(res.id, "test_id")
          assert.equal(res.nickname, "test_nickname");
        });
      });
    });

    describe('異常系', () => {
      beforeEach(() => {
        mock.onGet('/users/me').reply(400, {});
      });

      it('エラーが発生すること', () => {
        return client.fetchMe().then(res => {
          assert.fail('Not come here.');
        }).catch(err => {
          assert.equal(err.response.status, 400);
        });
      });
    });
  });
});
