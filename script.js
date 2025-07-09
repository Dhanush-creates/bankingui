 const users = {
            "user1": {"password":"1234", "balance":1000},
            "user2": {"password":"5678", "balance":1555},
            "user3": {"password":"1233", "balance":2000},
            "user4": {"password":"password", "balance":5000}
        };

        let currentUser = null;
        let transactions = [];

        // Python login() function
        function login() {
            const name = document.getElementById('username').value;
            const pwd = document.getElementById('password').value;

            if (name in users && users[name]["password"] === pwd) {
                console.log(`Login Successful ${name}!`);
                return name;
            } else {
                console.log("Incorrect username or password!");
                return null;
            }
        }

        // Python show_balance() function
        function show_balance(user) {
            const balance = users[user]["balance"];
            console.log("Your account balance is ₹", balance);
            return balance;
        }

        // Python transfer_money() function
        function transfer_money(sender, receiver, amount) {
            if (!(receiver in users)) {
                console.log("Receiver not found!");
                return false;
            }

            if (amount <= 0) {
                console.log("Amount should be greater than Zero(0)");
                return false;
            }

            if (users[sender]["balance"] < amount) {
                console.log("You don't have enough balance to send money!");
                return false;
            }

            users[sender]["balance"] -= amount;
            users[receiver]["balance"] += amount;
            console.log(`₹${amount} transfered to ${receiver} account.`);
            return true;
        }

        // Python main() function logic
        function main() {
            console.log("-----------------------------------------------------------------");
            console.log("Welcome to banking application!");
            // UI handles the rest
        }

        // ============================================
        // UI HANDLER FUNCTIONS
        // ============================================

        function handleLogin() {
            const user = login();
            if (user) {
                currentUser = user;
                showAlert('loginAlert', `Login Successful ${user}!`, 'success');
                setTimeout(() => {
                    document.getElementById('loginScreen').classList.add('hidden');
                    document.getElementById('dashboardScreen').classList.remove('hidden');
                    updateDashboard();
                }, 1000);
            } else {
                showAlert('loginAlert', 'Incorrect username or password!', 'error');
            }
        }

        function handleCheckBalance() {
            const balance = show_balance(currentUser);
            showAlert('dashboardAlert', `Your account balance is ₹${balance}`, 'success');
        }

        function handleTransferMoney() {
            const receiver = document.getElementById('receiver').value;
            const amount = parseInt(document.getElementById('amount').value);

            if (!receiver || !amount) {
                showAlert('dashboardAlert', 'Please fill in all fields!', 'error');
                return;
            }

            const success = transfer_money(currentUser, receiver, amount);
            
            if (success) {
                // Add to transaction history
                transactions.push({
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    type: 'Transfer Sent',
                    amount: -amount,
                    recipient: receiver,
                    balance: users[currentUser]["balance"]
                });

                showAlert('dashboardAlert', `₹${amount} transfered to ${receiver} account.`, 'success');
                updateDashboard();
                hideTransferForm();
            } else {
                // Error messages are handled by the Python function
                if (!(receiver in users)) {
                    showAlert('dashboardAlert', 'Receiver not found!', 'error');
                } else if (amount <= 0) {
                    showAlert('dashboardAlert', 'Amount should be greater than Zero(0)', 'error');
                } else if (users[currentUser]["balance"] < amount) {
                    showAlert('dashboardAlert', "You don't have enough balance to send money!", 'error');
                }
            }
        }

        function handleLogout() {
            currentUser = null;
            console.log("Good bye!");
            document.getElementById('dashboardScreen').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            hideAllSections();
        }

        // ============================================
        // UI UTILITY FUNCTIONS
        // ============================================

        function showAlert(elementId, message, type) {
            const alert = document.getElementById(elementId);
            alert.textContent = message;
            alert.className = `alert alert-${type}`;
            alert.classList.remove('hidden');
            
            setTimeout(() => {
                alert.classList.add('hidden');
            }, 4000);
        }

        function updateDashboard() {
            document.getElementById('welcomeUser').textContent = currentUser;
            document.getElementById('balanceAmount').textContent = users[currentUser]["balance"];
            document.getElementById('accountHolder').textContent = currentUser.toUpperCase();
            document.getElementById('accountUsername').textContent = currentUser;
            document.getElementById('accountNumber').textContent = `ACC-${currentUser.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
        }

        function showTransferForm() {
            document.getElementById('transferForm').classList.remove('hidden');
            hideOtherSections('transferForm');
        }

        function hideTransferForm() {
            document.getElementById('transferForm').classList.add('hidden');
            document.getElementById('receiver').value = '';
            document.getElementById('amount').value = '';
        }

        function showTransactionHistory() {
            document.getElementById('transactionHistory').classList.remove('hidden');
            hideOtherSections('transactionHistory');
            updateTransactionHistory();
        }

        function hideTransactionHistory() {
            document.getElementById('transactionHistory').classList.add('hidden');
        }

        function showStatement() {
            document.getElementById('bankStatement').classList.remove('hidden');
            hideOtherSections('bankStatement');
            updateStatement();
        }

        function hideStatement() {
            document.getElementById('bankStatement').classList.add('hidden');
        }

        function hideOtherSections(activeSection) {
            const sections = ['transferForm', 'transactionHistory', 'bankStatement'];
            sections.forEach(section => {
                if (section !== activeSection) {
                    document.getElementById(section).classList.add('hidden');
                }
            });
        }

        function hideAllSections() {
            const sections = ['transferForm', 'transactionHistory', 'bankStatement'];
            sections.forEach(section => {
                document.getElementById(section).classList.add('hidden');
            });
        }

        function updateTransactionHistory() {
            const container = document.getElementById('transactionsList');
            
            if (transactions.length === 0) {
                container.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No transactions yet</p>';
                return;
            }

            container.innerHTML = transactions.map(transaction => `
                <div class="transaction-item">
                    <div class="transaction-header">
                        <span class="transaction-type">${transaction.type}</span>
                        <span class="transaction-amount negative">₹${Math.abs(transaction.amount)}</span>
                    </div>
                    <div class="transaction-details">
                        To: ${transaction.recipient} • ${transaction.date} ${transaction.time}
                    </div>
                </div>
            `).reverse().join('');
        }

        function updateStatement() {
            document.getElementById('statementHolder').textContent = currentUser.toUpperCase();
            document.getElementById('statementPeriod').textContent = `${new Date().toLocaleDateString()} - ${new Date().toLocaleDateString()}`;
            document.getElementById('statementBalance').textContent = users[currentUser]["balance"];
            
            const tbody = document.getElementById('statementBody');
            
            if (transactions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666; padding: 2rem;">No transactions to display</td></tr>';
                return;
            }
            
            tbody.innerHTML = transactions.map(transaction => `
                <tr>
                    <td>${transaction.date}</td>
                    <td>${transaction.type} to ${transaction.recipient}</td>
                    <td style="color: #dc3545;">₹${Math.abs(transaction.amount)}</td>
                    <td>₹${transaction.balance}</td>
                </tr>
            `).join('');
        }

        // Enter key support for login
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });

        // Initialize the application
        main();
