const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');

const db = require('./models');
const passportConfig = require('./passport');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();
app.set('port', process.env.PORT || 3010);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: 'https://nodebird.ml',
      credentials: true,
    })
  );
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' && '.nodebird.ml',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에서 서버가 실행 중입니다.`);
});
