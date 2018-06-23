<?php

class HTTPRequester {

    public static function HTTPPost($accountSid, $authToken, $url, array $params) {
        $query = http_build_query($params);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_USERPWD, $accountSid . ":" . $authToken);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }

}
?>

<?php

echo '+++ Start.';
$accountSid = getenv("ACCOUNT_SID");
$authToken = getenv('AUTH_TOKEN');
$syncServieSid = getenv('SYNC_SERVICE_SID');
$syncMapName = getenv('SYNC_MAP_NAME');

$url = "https://sync.twilio.com/v1/Services/{$syncServieSid}/Maps";
$data = array(
    'Ttl' => 0, // 0 - never expires
    'UniqueName' => $syncMapName
);

echo "\xA++ The request URL: ", $url;
$http = new HTTPRequester();
$response = $http->HTTPPost($accountSid, $authToken, $url, $data);
echo "\xA+ Response: {$response}";
echo '\xA+++ Exit.\xA';
?>
