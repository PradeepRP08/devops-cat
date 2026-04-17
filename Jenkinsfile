pipeline {
  agent any

  environment {
    IMAGE_NAME = "pradeeprp/job-portal-frontend"   // change if needed
    IMAGE_TAG = "latest"
  }

  tools {
    nodejs 'nodejs'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Frontend') {
      steps {
        dir('client') {
          sh 'npm install'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('client') {
          sh 'npm run build'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        script {
          def scannerHome = tool 'sonar-scanner'
          withSonarQubeEnv('sonar') {
            dir('client') {
              sh "${scannerHome}/bin/sonar-scanner"
            }
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 10, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
        }
      }
    }
  }
}