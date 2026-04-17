pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/PradeepRP08/devops-cat.git'
            }
        }

        stage('Server Install') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Client Install') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pradeeprp/devops-app:v1 .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push pradeeprp/devops-app:v1'
            }
        }
    }
}