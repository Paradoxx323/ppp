import { ServerPage } from '../../../shared/pages/server.js';
import { SUPPORTED_SERVER_TYPES } from '../../../shared/const.js';
import { html } from '../../../shared/template.js';
import { ref } from '../../../shared/element/templating/ref.js';
import { when } from '../../../shared/element/templating/when.js';
import { css } from '../../../shared/element/styles/css.js';
import { pageStyles, loadingIndicator } from '../page.js';

export const serverPageTemplate = (context, definition) => html`
  <template>
    <${'ppp-page-header'} ${ref('header')}>
      ${(x) => (x.server ? `Сервер - ${x.server?.name}` : 'Сервер')}
    </ppp-page-header>
    <form ${ref('form')} novalidate onsubmit="return false">
      <div class="loading-wrapper" ?busy="${(x) => x.busy}">
        <section>
          <div class="label-group">
            <h5>Название сервера</h5>
            <p>Произвольное имя, чтобы ссылаться на этот профиль, когда
              потребуется.</p>
          </div>
          <div class="input-group">
            <ppp-text-field
              placeholder="Введите имя"
              value="${(x) => x.server?.name}"
              ${ref('serverName')}
            ></ppp-text-field>
          </div>
        </section>
        <section>
          <div class="label-group">
            <h5>Адрес</h5>
            <p>Укажите имя хоста или IP-адрес сервера.</p>
          </div>
          <div class="input-group">
            <ppp-text-field
              type="url"
              placeholder="127.0.0.1"
              value="${(x) => x.server?.hostname}"
              ${ref('hostname')}
            ></ppp-text-field>
          </div>
        </section>
        <section>
          <div class="label-group">
            <h5>Порт</h5>
            <p>Укажите SSH-порт сервера.</p>
          </div>
          <div class="input-group">
            <ppp-text-field
              placeholder="22"
              value="${(x) => x.server?.port ?? '22'}"
              ${ref('port')}
            ></ppp-text-field>
          </div>
        </section>
        <section>
          <div class="label-group">
            <h5>Имя пользователя</h5>
            <p>Название базы данных для подключения.</p>
          </div>
          <div class="input-group">
            <ppp-text-field
              placeholder="root"
              value="${(x) => x.server?.username ?? 'root'}"
              ${ref('userName')}
            ></ppp-text-field>
          </div>
        </section>
        ${when(
          (x) =>
            x.server?.type === SUPPORTED_SERVER_TYPES.PASSWORD ||
            (!x.server &&
              x.app.params().type === SUPPORTED_SERVER_TYPES.PASSWORD),
          html`
            <section>
              <div class="label-group">
                <h5>Пароль</h5>
                <p>Будет сохранён в зашифрованном виде.</p>
              </div>
              <div class="input-group">
                <ppp-text-field
                  type="password"
                  placeholder="Введите пароль"
                  value="${(x) => x.server?.password}"
                  ${ref('password')}
                ></ppp-text-field>
              </div>
            </section>
          `
        )}
        ${when(
          (x) =>
            x.server?.type === SUPPORTED_SERVER_TYPES.KEY ||
            (!x.server && x.app.params().type === SUPPORTED_SERVER_TYPES.KEY),
          html`
            <section>
              <div class="label-group">
                <h5>Приватный ключ</h5>
                <p>Будет сохранён в зашифрованном виде.</p>
              </div>
              <div class="input-group">
                <${'ppp-text-area'}
                  monospace
                  placeholder="Введите ключ"
                  value="${(x) => x.server?.privateKey}"
                  ${ref('privateKey')}
                ></ppp-text-area>
                <${'ppp-button'}
                  class="margin-top"
                  @click="${(x) => x.loadPrivateKey()}"
                  appearance="primary"
                >
                  Загрузить из файла
                </ppp-button>
                <input ${ref('fileInput')}
                       @change="${(x, c) => x.handleFileSelection(c)}"
                       type="file"
                       style="display: none;"/>
              </div>
            </section>
          `
        )}
        <div class="folding">
          <div class="folding-header" @click="${(x, c) =>
            c.event.target.parentNode.classList.toggle('folding-open')}"
          >
            <div class="folding-header-toggle">
              <img slot="logo" draggable="false" alt="Toggle"
                   src="static/fa/angle-down.svg"/>
            </div>
            <div class="folding-header-text">Дополнительно</div>
          </div>
          <div class="folding-content">
            <section>
              <div class="label-group">
                <h5>Команды перед настройкой</h5>
                <${'ppp-banner'} class="inline margin-top" appearance="warning">
                  Поддерживаются только RHEL-совместимые операционные системы.
                </ppp-banner>
                <p>
                  Произвольные команды, которые можно использовать в отладочных
                  целях.
                </p>
              </div>
              <div class="input-group">
                <${'ppp-text-area'}
                  monospace
                  placeholder="Введите команды"
                  ${ref('extraCommands')}
                ></ppp-text-area>
              </div>
            </section>
          </div>
        </div>
        <${'ppp-modal'} ${ref('terminalModal')}>
          <span slot="title">Настройка сервера</span>
          <div slot="body">
            <div class="description">
              <${'ppp-terminal'} ${ref('terminalDom')}></ppp-terminal>
            </div>
          </div>
        </ppp-modal>
        ${when((x) => x.busy, html`${loadingIndicator()}`)}
      </div>
      <section class="last">
        <div class="footer-actions">
          <${'ppp-button'}
            ?disabled="${(x) => x.busy || x.server?.removed}"
            type="submit"
            @click="${(x) => x.setupServer()}"
            appearance="primary"
          >
            ${(x) => (x.server ? 'Обновить сервер' : 'Добавить сервер')}
          </ppp-button>
        </div>
      </section>
    </form>
    </div>
  </template>
`;

export const serverPageStyles = (context, definition) =>
  css`
    ${pageStyles}
    ppp-modal .description {
      padding: 10px 16px 10px 20px;
      border-radius: 7px;
      background-color: rgb(33, 49, 60);
      border: 1px solid rgb(231, 238, 236);
    }
  `;

// noinspection JSUnusedGlobalSymbols
export const serverPage = ServerPage.compose({
  baseName: 'server-page',
  template: serverPageTemplate,
  styles: serverPageStyles
});
