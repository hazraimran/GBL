              import React, { useContext, useState} from 'react';
              import { authService } from '../../services/firestore/authentication';
              import GameContext from '../../context/GameContext';

              const Login: React.FC = () => {
                const [email, setEmail] = useState('');
                const [password, setPassword] = useState('');
                const [error, setError] = useState('');
                const {navTo } = useContext(GameContext);  

                const handleStorageLogin = () => {
                  localStorage.setItem('game:isLoggedIn', 'true');
                  localStorage.setItem('game:userEmail', email);
                  navTo('LEVELS')
                };


                const handleLogin = async (e: React.FormEvent) => {
                  e.preventDefault();
                  try { 
                    await authService.signIn(email, password);
                    handleStorageLogin()
                  } catch (err) {
                    setError('Add a valid email and password (min 6 characters)');
                    console.error(err);
                  }
                };

                const handleSignUp = async () => {
                  try {
                    await authService.signUp(email, password);
                    handleStorageLogin()
                  } catch (err) {
                    setError('Add a valid email and password (min 6 characters)');
                    console.error(err);
                  }
                };

                return (
                  <div className="mt-8 p-6 bg-black/50 backdrop-blur-sm rounded-lg">
                    <form className="space-y-4" onSubmit={handleLogin}>
                      {error && <div className="text-red-500 text-sm">{error}</div>}
                      <div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                          autoComplete="email"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors"
                        >
                          Login
                        </button>
                        <button
                          type="button"
                          onClick={handleSignUp}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                  </div>
                );
              };

              export default Login;