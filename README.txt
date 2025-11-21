STACK REWARD SYSTEM (Points + Badges + Leaderboard)
===================================================

Main folder: stack-reward-system
Backend: stack-reward-system/backend
Frontend: stack-reward-system/frontend

Features:
- Register / Login (JWT)
- Ask questions
- Answer questions
- Reward system:
    * +5 points when user posts an answer
    * When an answer reaches 5 upvotes total, author gets a one-time +5 bonus
    * -5 points when answer gets a downvote
    * -5 points when answer is deleted (removes original posting reward)
- Badges:
    * 0-49 points   -> Newbie
    * 50-199 points -> Bronze
    * 200-499 points-> Silver
    * 500+ points   -> Gold
    Badges auto-update whenever points change (answers, votes, transfers).
- Transfer points:
    * User must have more than 10 points to transfer
    * Transfer by receiver email
    * Sender points decrease, receiver points increase
- Profile page:
    * Shows name, email, points, badge
- Leaderboard:
    * Top users by points with badges and join date
- Modern UI layout for all pages

BACKEND SETUP
-------------
1) Open terminal
2) cd stack-reward-system/backend
3) npm install
4) (optional) Create .env file:
      MONGO_URI=mongodb://127.0.0.1:27017/stack_reward_system
      JWT_SECRET=yoursecret
5) Run:
      npm run dev
   or:
      npm start
   Backend: http://localhost:5000

FRONTEND SETUP
--------------
1) New terminal
2) cd stack-reward-system/frontend
3) npm install
4) npm start
   Frontend: http://localhost:3000
