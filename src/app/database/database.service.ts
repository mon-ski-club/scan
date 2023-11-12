import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import {
  RxCollection,
  RxDatabase,
  RxDocument,
  addRxPlugin,
  createRxDatabase,
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { SettingsService } from '../settings/settings.service';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import {
  replicateCouchDB,
  getFetchWithCouchDBAuthorization,
} from 'rxdb/plugins/replication-couchdb';
import { v4 as uuid } from 'uuid';
import { EVENT_SCHEMA } from '../event/event.schema';
import { Event } from '../event/event';

type EventDocumentMethods = {};
export type EventDocument = RxDocument<Event, EventDocumentMethods>;
export type EventCollection = RxCollection<Event, EventDocumentMethods, {}>;

type ApplicationCollections = {
  events: EventCollection;
};

var database: RxDatabase<ApplicationCollections> | null = null;

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor() {}

  get(): RxDatabase<ApplicationCollections> {
    return database!;
  }
}

function authenticate(
  settingsService: SettingsService,
  httpClient: HttpClient,
) {
  httpClient.post<any>(
    `${settingsService.url}/_session`,
    {
      name: `${settingsService.user}`,
      password: `${settingsService.password}`,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    },
  );
}

function replicate(
  settingsService: SettingsService,
  database: RxDatabase<any>,
  collectionName: string,
) {
  const collection: RxCollection<any> = database.collections[collectionName];
  replicateCouchDB({
    collection: collection,
    url: `${settingsService.url}/${collectionName}/`,
    live: true,
    fetch: getFetchWithCouchDBAuthorization(
      `${settingsService.user}`,
      `${settingsService.password}`,
    ),
    pull: {},
    push: {},
  });

  collection
    .count()
    .exec()
    .then((c) => console.debug(`${collectionName} synchronized: ${c}`));
}

function addPlugins() {
  addRxPlugin(RxDBAttachmentsPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBQueryBuilderPlugin);

  if (isDevMode()) {
    addRxPlugin(RxDBDevModePlugin);
  }
}

export async function createDatabase(
  settingsService: SettingsService,
  httpClient: HttpClient,
): Promise<RxDatabase<ApplicationCollections>> {
  addPlugins();

  database = await createRxDatabase<ApplicationCollections>({
    name: 'scan',
    storage: getRxStorageDexie(),
  });
  console.debug('database created');

  await database.addCollections({
    events: { schema: EVENT_SCHEMA },
  });
  console.debug('collections added');

  database.collections.events.preInsert(function (event: Event) {
    event.id = uuid();
  }, false);

  // Synchronize with CouchDB
  // TODO: authenticate(settingsService, httpClient);
  // TODO: replicate(settingsService, database, 'persons');

  console.debug('database synchronized');

  return database;
}
