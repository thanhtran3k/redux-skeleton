# redux-skeleton
1. Angular client application included abstracted redux flow and oidc-client. You know, a skeleton for you to add some meat.
2. What i used
 - Angular 9.1.7
 - typescript: 3.8.3
 - rxjs: 6.5.4
 - bootstrap: 6.1
 - oidc-client: 1.10.1

# How can i use it?
For example, i will have a component that can add and read article for my website.

1. Your component will look like this
```
article
-->child-article-component
-->article.state
  -->article.actions.ts
  -->article.effects.ts
  -->article.reducer.ts
  -->article.selectors.ts
  -->article.state.ts
-->article.module.ts
```

2. article.actions.ts is where you define your action and this is how it looks like

```typescript
import { Action } from '@ngrx/store';
import { BaseSuccessAction, BaseFailedAction } from 'src/shared/model/action.interface';

export enum ArticleActionNames {
    GET_ALL_ARTICLES = '[ARTICLE] Get all articles',    
    //And you add more here
    
    ACTION_SUCCESS = '[ARTICLE] Action Success',
    ACTION_FAILED = '[ARTICLE] Action Failed'
}

export interface ArticleAction extends Action {
    type: ArticleActionNames;
    payload?: any;
}

export class GetAllArticlesAction implements Action {
    type = ArticleActionNames.GET_ALL_ARTICLES;
    constructor() { }
}

export class CreateArticleAction implements Action {
    type = ArticleActionNames.CREATE_ARTICLE;
    constructor(public payload: any) { }
}

//Abstract success and failed action
export class ArticleSuccessAction implements Action {
    type = ArticleActionNames.ACTION_SUCCESS;
    constructor(public subType: ArticleActionNames, public payload: any) { }
}

export class ArticleFailedAction implements Action {
    type = ArticleActionNames.ACTION_FAILED;
    constructor(public subType: ArticleActionNames, public payload: any) { }
}

```

3. article.effects.ts is where you handle side effect model for Store
```typescript
//Just a little code for you to understand

@Effect()
    getAllArticles$ = this.actions$.pipe(
        ofType(ArticleActionNames.GET_ALL_ARTICLES),
        switchMap((action: GetAllArticlesAction) => {
            return this.articleService
                .getAllArticles()
                .pipe(
                    map(articles => {
                        return new ArticleSuccessAction(ArticleActionNames.GET_ALL_ARTICLES, articles)
                    }),
                    catchError((err: any) => of(new ArticleFailedAction(action.type, err)))
                )
        })
    );
    
```

4. article.reducer.ts are responsible for handling transitions from one state to the next state in your application. If your action is failed, use the original value, and if you success, use the newer value.
```typescript
//init state
export const initialArticleState: IArticleState = {
    Articles: [],
    UserArticles: [],
    Article: new Article()
};

export function articleReducer(
    articleState: IArticleState = initialArticleState,
    action: ArticleAction
): IArticleState {
    switch (action.type) {
        case ArticleActionNames.ACTION_SUCCESS:
            return actionSuccessReducer(
                articleState,
                action as ArticleSuccessAction
            );
        case ArticleActionNames.ACTION_FAILED:
            return actionFailReducer(
                articleState,
                action as ArticleSuccessAction
            )
        default:
            return articleState;
    };
}

function actionSuccessReducer(
    articleState: IArticleState,
    action: ArticleSuccessAction
): IArticleState {
    switch (action.type) {
        case ArticleActionNames.GET_ALL_ARTICLES:
            const articlesList = action.payload as Article[];
            // equivalent to Object.assign({}, payload);
            return {
                ...articleState,
                Articles: articlesList
            };
        case ArticleActionNames.GET_ARTICLE_BY_USER:
            const userArticleList = action.payload as UserArticle[];
            return {
                ...articleState,
                UserArticles: userArticleList
            }
        case ArticleActionNames.GET_ARTICLE_DETAILS:
            const articleDetail = action.payload as Article;
            return {
                ...articleState,
                Article: articleDetail
            }
        default:
            return articleState;
    }
}

function actionFailReducer(
    articleState: IArticleState,
    action: ArticleFailedAction
): IArticleState {
    switch (action.subType) {
        default:
            return articleState;
    }
}
```

5. article.selectors.ts are pure functions used for obtaining slices of store state.

```typescript

//IArticleState from article.state
export const getArticleState = createFeatureSelector<IArticleState>(
    'ArticleModule'
);

const getArticles = createSelector(
    getArticleState,
    (state: IArticleState) => state.Articles
);

const getUserArticles = createSelector(
    getArticleState,
    (state: IArticleState) => state.UserArticles
);

const getArticleDetail = createSelector(
    getArticleState,
    (state: IArticleState) => state.Article
);

@Injectable()
export class ArticleSelectors extends BaseSelector {
    public article$: Observable<Article[]>;
    public userArticle$: Observable<UserArticle[]>;
    public articleDetail$: Observable<Article>;

    constructor(private store: Store<any>, private articleActions: Actions) {
        super(articleActions, ArticleActionNames.ACTION_SUCCESS, ArticleActionNames.ACTION_FAILED);
        
        this.article$ = this.store.select(getArticles);
        this.userArticle$ = this.store.select(getUserArticles);
        this.articleDetail$ = this.store.select(getArticleDetail);
    }
}
```

6. article.state.ts is just where i save my instances of state
```typescript
export interface IArticleState {
    Articles: Article[];
    UserArticles: UserArticle[];
    Article: Article;
}
```

7. Don't forget to import to your module
```typescript
imports: [
EffectsModule.forFeature([ArticleEffects]),
StoreModule.forFeature('ArticleModule', articleReducer),
]

providers: [
    AuthorizeGuard,
    ArticleService,
    ArticleSelectors
  ]
```

## How can i call it in component.ts and how do i deal with memory leak?
```typescript
export class ArticleListComponent extends SafeUnsubscriber implements OnInit {
  article: Article = new Article();

  constructor(
    private articleSelector: ArticleSelectors,
    private dispatcher: Dispatcher,
  ) {
    super();
    this.safeSubscriptions(this.registerSubcriptions());
  }

  //(3) Hey, i handle Subscription, i will unsuscribe everything in this array when component is destroy
  private registerSubcriptions(): Subscription[] {
    return [
      this.articleSelector
      .actionSuccessOfSubtype$(ArticleActionNames.GET_ALL_ARTICLES)
      .subscribe(action => {
      //(4.1) Oh, im subscribing this success action, if it's good i will dosomething 
        this.article = action.payload;
      }),
      
      this.articleSelector
      .actionFailedOfSubtype$(ArticleActionNames.GET_ALL_ARTICLES)
      .subscribe(action => {
      //(4.2) Oh, im subscribing this failed action, something wrong 
        console.log('something is wrong!');
      }),
    ];
  }

  ngOnInit() {
  //(1) Hey, i will run first, when component initialize
    this.getAllArticles();
  }

  getAllArticles() {
  //(2) Okay, i will dispatch an action
    this.dispatcher.fire(new GetAllArticlesAction());
  }
}
```
## Configurate OIDC Client
1. Just find src/environments/app.config.ts and apply your settings

```typescript
export const IDENTITY_CONFIG = {
    CLIENT_ID: 'fuhocommerce_sellerchannel',
    IDENTITY_SERVER: 'https://localhost:5000',
    APPLICATION_URL: 'http://localhost:4200',
    RESPONSE_TYPE: 'id_token token',    
    SCOPE: 'openid profile email'
}
```
