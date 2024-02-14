#!/usr/bin/env bash

readonly PROGNAME=$(basename $0)
readonly ARGS="$@"

# Color codes

black='\033[0;30m'   # Black
red='\033[0;31m'     # Red
green='\033[0;32m'   # Green
yellow='\033[0;33m'  # Yellow
blue='\033[0;34m'    # Blue
purple='\033[0;35m'  # Purple
cyan='\033[0;36m'    # Cyan
white='\033[0;37m'   # White
endcolor='\033[0m'   # Text Reset
bold='\033[1m'       # Bold Text

# Strings

bullet="  ${cyan}*${endcolor}  "
header="${cyan} ### ${endcolor}"
notice="  ${yellow}!>${endcolor}  "
rocket="  ${cyan}=>${endcolor}  "

# f(x)

function get_current_pkg_version() {
  CURRENT_VERSION=$(node -p 'require("./package.json").version')
}

function set_pkg_version() {
  # varz
  VERSION=false
  UPDATED=false
  IFS=''
  input="package.json"
  output="package.json.tmp"
  # start
  printf "${rocket}${bold}Updating version in package.json to ${TARGET_VERSION}..."
  cat /dev/null > ${output}
  cat $input |
  while read line
  do
    [[ $line =~ ${CURRENT_VERSION} ]] && VERSION=true;
    if [[ $VERSION == true && $UPDATED == false ]]
    then
      UPDATED=true
      echo "  \"version\": \"${TARGET_VERSION}\"," >> ${output}
    else
      echo ${line} >> ${output}
    fi
  done
  mv ${output} ${input}
  echo -e "${green}Done!${endcolor}"
}

function check_target_version() {
  if [[ -z ${TARGET_VERSION} ]]
  then
    echo -e "${red}Must provide a target release for pre-releases!"
    echo
    exit 1
  fi
  # if [[ ${TARGET_VERSION/-unstable/} =~ ${CURRENT_VERSION/-unstable/} ]]
  # then
  #   echo -e "${red}Target version must not match current version!"
  #   echo
  #   exit 1
  # fi
}

function prep_changelog_for_release() {
  # varz
  LATEST=false
  UPDATED=false
  SIMPLE_DATE=`date +%F`
  IFS=''
  input="CHANGELOG.md"
  output="CHANGELOG.md.tmp"
  # start
  printf "${rocket}${bold}Preparing CHANGELOG.md for ${TARGET_VERSION} release..."
  cat /dev/null > ${output}
  cat $input |
  while read line
  do
    [[ $line =~ "#### [${CURRENT_VERSION}" ]] && LATEST=true;
    if [[ $LATEST == true && $UPDATED == false ]]
    then
      UPDATED=true
      echo "#### [${TARGET_VERSION} (${SIMPLE_DATE})](https://github.com/niaid/moleculer-netsparker-cloud/releases/tag/${TARGET_VERSION})" >> ${output}
    else
      echo ${line} >> ${output}
    fi
  done
  mv ${output} ${input}
  echo -e "${green}Done!${endcolor}"
}

function put_changelog_boilerplate() {
  printf "${rocket}${bold}Preparing CHANGELOG.md for unstable development...${endcolor}"
  read -r -d '' CHANGELOG_BOILER <<-EOF
#### [${TARGET_VERSION} (latest)](https://github.com/niaid/moleculer-netsparker-cloud/)


##### FEATURE
- 

##### IMPROVEMENT
- 

##### BUG FIX
- 

---
EOF
  echo "$CHANGELOG_BOILER" >> CHANGELOG.md.tmp
  cat CHANGELOG.md >> CHANGELOG.md.tmp
  mv CHANGELOG.md.tmp CHANGELOG.md
  echo -e "${green}Done!${endcolor}"
}

function checkout_release_branch() {
  RES=''
  case ${ACTION} in
    PRE)
      RES=$(git checkout -b pre-release-${TARGET_VERSION} 2>&1)
      ;;
    POST)
      RES=$(git checkout -b post-release-${TARGET_VERSION} 2>&1)
      ;;
  esac
  echo -e "${rocket}${bold}${RES}...${endcolor}${green}Done!${endcolor}"
}

function do_NPM_install() {
  printf "${rocket}${bold}Installing NPM dependencies (includes postinstall)...${endcolor}"
  # `--legacy-peer-deps` flag is currently required due to angular version
  npm install --legacy-peer-deps >/dev/null 2>&1
  echo -e "${green}Done!${endcolor}"
}

function pre_release_last_steps() {
  echo -e "${notice}${bold}Perform the following steps to finish the PRE-RELEASE:${endcolor}"
  echo -e "${bullet}remove empty sections in CHANGELOG.md${endcolor}"
  echo -e "${bullet}make any necessary final release changes${endcolor}"
  echo -e "${bullet}commit the changes: ${cyan}git commit -m \"prepare release\"${endcolor}"
  echo -e "${bullet}push the release branch to the remote: ${cyan}git push origin head${endcolor}"
  echo -e "${bullet}open a PR (with review if desired): ${cyan}https://github.com/niaid/moleculer-netsparker-cloud/pull/new/pre-release-${TARGET_VERSION}${endcolor}"
  echo -e "${bullet}once merged, create a new release in GitHub using details from CHANGELOG.md${endcolor}"
  echo -e "${bullet}review the release/depeloyment process documentation: ${cyan}https://github.com/niaid/moleculer-netsparker-cloud/wiki/Deployment-Process${endcolor}"
}

function post_release_last_steps() {
  echo -e "${notice}${bold}Perform the following steps to finish the POST-RELEASE:${endcolor}"
  echo -e "${bullet}ensure boilerplate sections in CHANGELOG.md${endcolor}"
  echo -e "${bullet}commit the changes: ${cyan}git commit -m \"prepare trunk for continued development\"${endcolor}"
  echo -e "${bullet}push the release branch to the remote: ${cyan}git push origin head${endcolor}"
  echo -e "${bullet}open/merge a PR (review unnecessary): ${cyan}https://github.com/niaid/moleculer-netsparker-cloud/pull/new/post-release-${TARGET_VERSION}${endcolor}"
}

function main() {
  # get the target version from ARGS
  TARGET_VERSION=${ARGS}

  # load the current version
  get_current_pkg_version

  # determine if we are doing a pre or post release
  if [[ ${CURRENT_VERSION} =~ "-unstable" ]]
  then
    # do pre-release
    ACTION=PRE
  else
    # do post-release
    ACTION=POST
  fi

  if [[ -z ${TARGET_VERSION} ]]
  then
    echo -e "${header}${bold}Current version:${endcolor} ${blue}${CURRENT_VERSION}${endcolor}"
    echo -e "${header}${green}To create a ${ACTION}-RELEASE branch, run the command:"
    echo
    echo -e "${cyan}\tnpm run release -- <target>${endcolor}"
    exit 0
  fi

  case ${ACTION} in
    PRE)
      check_target_version
      echo -e "${header}${bold}Performing package pre-release: ${CURRENT_VERSION} => ${TARGET_VERSION}!${header}"
      # checkout pre-release branch
      checkout_release_branch
      # update package.json version
      set_pkg_version
      # update changelog
      prep_changelog_for_release
      ## perform NPM install to update package-lock.json to new version
      do_NPM_install
      ## provide last steps notice
      pre_release_last_steps
      ;;
    POST)
      # set the target version to latest-unstable for post release
      TARGET_VERSION="${TARGET_VERSION}-unstable"
      echo -e "${header}${bold}Performing package post-release: ${CURRENT_VERSION} => ${TARGET_VERSION}!${header}"
      # checkout post-release branch
      checkout_release_branch
      # update package.json version w/ '-next'
      set_pkg_version
      # update changelog with boilerplate
      put_changelog_boilerplate
      ## perform NPM install to update package-lock.json to new version
      do_NPM_install
      ## provide last steps notice
      post_release_last_steps
      ;;
    *)
      echo -e "${red}[ERROR] Please provide an action and options.${endcolor}"
      echo
      usage
      exit 1
      ;;
  esac
}

main
exit 0
